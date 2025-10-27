import { g_utils } from "@/utils/bonProtocol";
import axios from "axios";

export const bin2token = async (arrayBuffer: ArrayBuffer) => {
  // 如果是data URL格式，提取base64部分
  const res = await axios.post('https://xxz-xyzw.hortorgames.com/login/authuser', arrayBuffer, {
    params: {
      _seq: 1,
    },
    headers: {
      'Content-Type': 'application/octet-stream',
      "referrerPolicy": "no-referrer",
    },
    responseType: 'arraybuffer'
  })
  console.log('转换Token:', typeof res.data);

  const msg = g_utils.parse(res.data);
  console.log('解析结果:', msg);


  const data = msg.getData();
  console.log('数据内容:', data);

  const currentTime = Date.now();
  const sessId = currentTime * 100 + Math.floor(Math.random() * 100);
  const connId = currentTime + Math.floor(Math.random() * 10);

  return JSON.stringify({
    ...data,
    sessId,
    connId,
    isRestore: 0
  });
};

export const url2token = async (sourceUrl: string) => {
  let resp = await axios.get(sourceUrl, {
    headers: {
      "Accept": "application/json"
    }
  })
  if (resp.status !== 200) {
    throw new Error(`请求失败: ${resp.status} ${resp.statusText}`)
  }
  if (!resp.data.token) {
    throw new Error('返回数据中未找到token字段')
  }
  return resp.data.token;
};