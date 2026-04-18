## 面试问题生成：

curl -X POST http://localhost:3000/interview/resume/quiz/stream \  
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQ5ZTJjNDY4YjAyNzFkYmVkMGE1MjMiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzc2MzM0MjU3LCJleHAiOjE3NzY5MzkwNTd9.-Gp25yMSrZ6qgEViB4Pe9VVtyjX63W7J8p-e-wAxGKs" \
 -d '{"resumeURL": "https://res.lgdsunday.club/sunday-resume.pdf","company": "阿里巴巴", "positionName": "前端开发工程师", "minSalary": 25, "maxSalary": 35, "jd":"熟练掌握 Vue.js 框架及生态（Vue2、主 Vue3），能独立完成中大型项目的前端开发，精通 HTML5、css3、javascript （ES6），熟悉Flex、Grid等布局方式，了么前端工程化（webpack、vite），能解决不同浏览器兼容问题，有前端性能优化经验者优先"}'

## 面试开始

curl -X POST http://localhost:3000/interview/mock/start \  
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQ5ZTJjNDY4YjAyNzFkYmVkMGE1MjMiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzc2Mzk2MzU0LCJleHAiOjE3NzcwMDExNTR9.WWKzz7lkHLyow_IC9TPGtDeR_Of3aGK2ZL6YFJmYoXA" \
 -d '{"interviewType":"special", "candidateName":"Rowan","company": "阿里巴巴", "positionName": "前端开发工程师", "minSalary": 25, "maxSalary": 35, "jd":"熟练掌握 Vue.js 框架及生 态（Vue2、主 Vue3），能独立完成中大型项目的前端开发，精通 HTML5、css3、javascript（ES6），熟悉Flex、Grid等布局方式，了么前端工程化（webpack、vite），能解决不同浏览器兼容问题，有前 端性能优化经验者优先", "resumeContent":"我叫 Rowan 是一位前端开发工程师，目前有4年工作经验"}'

## 问答交流

curl -X POST http://localhost:3000/interview/mock/answer \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQ5ZTJjNDY4YjAyNzFkYmVkMGE1MjMiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzc2Mzk2MzU0LCJleHAiOjE3NzcwMDExNTR9.WWKzz7lkHLyow_IC9TPGtDeR_Of3aGK2ZL6YFJmYoXA" \
 -d '{"sessionId":"a03380f5-d75e-4350-8ebe-c85bf869b8dc","answer": "我是 rowan 目前有四年开发经验，熟悉 vue 和 react 架构设计方案，还有自主实现了 next 服务端渲染"}'

## 回复面试

curl -X POST http://localhost:3000/interview/mock/resume/207e272f-b75b-4929-aff4-f068276da5a4 \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQ5ZTJjNDY4YjAyNzFkYmVkMGE1MjMiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzc2Mzk2MzU0LCJleHAiOjE3NzcwMDExNTR9.WWKzz7lkHLyow_IC9TPGtDeR_Of3aGK2ZL6YFJmYoXA"

## 终止会话

curl -X POST http://localhost:3000/interview/mock/end/207e272f-b75b-4929-aff4-f068276da5a4 \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQ5ZTJjNDY4YjAyNzFkYmVkMGE1MjMiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzc2Mzk2MzU0LCJleHAiOjE3NzcwMDExNTR9.WWKzz7lkHLyow_IC9TPGtDeR_Of3aGK2ZL6YFJmYoXA"

## 生成分析报告

curl -X GET http://localhost:3000/interview/analysis/report/f225db25-e153-4df1-accd-73fb984c3fbe \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQ5ZTJjNDY4YjAyNzFkYmVkMGE1MjMiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzc2Mzk2MzU0LCJleHAiOjE3NzcwMDExNTR9.WWKzz7lkHLyow_IC9TPGtDeR_Of3aGK2ZL6YFJmYoXA"
