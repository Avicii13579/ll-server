import axios from 'axios';
/**
 * 对后端同一返回的数据做处理
 * {
 *  code: 200,
 *  message:'success',
 *  data: {},
 *  timestamp: '',
 *  path: 'user/info'
 * }
 */
type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
};

const baseURL = process.env.LL_API_BASE_URL ?? 'http://127.0.0.1:3000';
const token = process.env.LL_JWT_TOKEN;

// 做前置校验
if (!token) {
  throw new Error('缺少 LL_JWT_TOKEN，请检查 mcp/.env 配置');
}

// 创建 axios 事例
const http = axios.create({
  baseURL,
  timeout: 3000,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// 封装 Get 方法
async function get<T>(url: string): Promise<T> {
  // 发送请求
  const response = await http.get<ApiResponse<T>>(url);
  // 取出响应体
  const payload = response.data;

  // 处理异常
  if (payload.code >= 400) {
    throw new Error(payload.message || '接口调用失败');
  }

  return payload.data;
}

// 获取用户信息
export async function getCurrentUserinfo() {
  return get<Record<string, unknown>>('/users/info');
}

// 获取用户消费记录
export async function getUserConsumptionRecords() {
  return get<Record<string, unknown>>('/users/consumption-records');
}

// 获取分析报告
export async function getAnalysisReport(resultId: string) {
  return get<Record<string, unknown>>(`/interview/analysis/report/${resultId}`);
}
