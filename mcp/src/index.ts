import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  getAnalysisReport,
  getCurrentUserinfo,
  getUserConsumptionRecords,
} from './api.js';
import { z } from 'zod';

/**
 * 创建一个 MCP Server 事例
 */
const server = new McpServer({
  name: 'llserver-mcp',
  version: '1.0.0',
});

/**
 * 注册第一个 Tool：获取当前登录用户信息
 */
server.registerTool(
  'get_current_user_info',
  {
    description: '获取当前登录用户信息',
    inputSchema: {}, // 空对象表示 Tool 不需要任何输入参数
  },
  async () => {
    // 调用在 api.ts 里封装好的业务函数，去请求后端接口
    const user = await getCurrentUserinfo();

    // 按照 MCP 约定结构返回 一个是 content 数组，每一项是一段返回内容
    return {
      content: [
        {
          type: 'text',
          //  JSON.stringify(user, null, 2) 参数一：要转化的数据，参数二：不自定义字段替换，参数三：缩紧两个空格
          text: JSON.stringify(user, null, 2),
        },
      ],
    };
  },
);

/**
 * 注册第二个 Tool：获取当前用户的消费记录
 */
server.registerTool(
  'get_user_consumption_record',
  {
    description: '获取当前用户消费记录',
    inputSchema: {},
  },
  async () => {
    const record = await getUserConsumptionRecords();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(record, null, 2),
        },
      ],
    };
  },
);

/**
 * 注册第三个 Tool：获取分析报告
 */
server.registerTool(
  'get_analysis_report',
  {
    description: '根据 resultId 获取分析报告',
    inputSchema: {
      resultId: z.string().describe('结果 ID'),
    },
  },
  async ({ resultId }) => {
    const record = await getAnalysisReport(resultId);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(record, null, 2),
        },
      ],
    };
  },
);

/**
 * main 函数：启动 mcp
 */
async function main() {
  /**
   * 创建 stdio 传输层
   * stdio = standard input / standard output 标准输入输出
   */
  const transport = new StdioServerTransport();

  // 将当前 MCP Server 连接到传输层上
  await server.connect(transport);

  // 打印日志：确认服务启动成功
  console.error('ll-server MCP server running on stdio');
}

/**
 * 执行 main 并统一处理启动异常
 */
main().catch((error) => {
  console.error('Fatal erroe in main():', error);

  /**
   * 非 0 状态退出进程
   */
  process.exit(1);
});
