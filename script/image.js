// superagent と ncmb をインポートする
const request = require('superagent');
const NCMB = require("ncmb");

// OpenAI API のエンドポイントと API キーを定義する
const url = 'https://api.openai.com/v1/images/generations';
const apiKey = 'YOUR_OPENAI_API_KEY';

// NCMB のアプリケーションキーとクライアントキーを定義する
const applicationKey = 'YOUR_APPLICATION_KEY';
const clientKey = 'YOUR_CLIENT_KEY';

// 生成する画像の数
const n = 1;
// 生成する画像のサイズ
const size = 256;
// レスポンスのフォーマット
const response_format = 'b64_json';

const ncmb = new NCMB(applicationKey, clientKey);

// 関数をエクスポートする
module.exports = async function(req, res) {
  // リクエストデータを作成する
  const { prompt } = req.body;
  const params = {
    prompt,
    n,
    size: `${size}x${size}`,
    response_format,
  };
  // OpenAI API に POST リクエストを送信し、レスポンスを受け取る
  const response = await request.post(url)
    .set('Content-Type', 'application/json') // ヘッダーに Content-Type を設定する
    .set('Authorization', `Bearer ${apiKey}`) // ヘッダーに API キーを設定する
    .send(JSON.stringify(params)); // JSON 形式のパラメータを送信する
  // レスポンスは base64 エンコードされているので、デコードする
  const base64String = response.body.data[0].b64_json;
  // デコードしたデータをバッファに変換する
  const buffer = Buffer.from(base64String, "base64");
  // バッファをファイルストアに保存する
  const fileName = `${Math.random().toString(32).substring(2)}.png`;
  await ncmb.File.upload(fileName, buffer);
  // ファイル名をレスポンスとして返す
  res.json({fileName});
}
