const csv = require("csvtojson");
const axios = require("axios");
const ObjectsToCsv = require("objects-to-csv");
const fs = require("fs");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const QUESTION_FILENAME = "cauhoi.csv";
const RESULT_TMP_FILENAME = "data-chatgpt-tmp.json";
const RESULT_FILENAME = "data-mysempai.csv";

// get data from server
const getData = async () => {
  try {
    // QUESTION FILENAME
    const csvData = await csv().fromFile(QUESTION_FILENAME);
    const lastData = [];

    for (let index = 38; index < csvData.length; index++) {
      const iterator = csvData[index];
      const messages = `Tôi có câu hỏi: ${iterator.cauhoi}
        4 đáp án để chọn: ${iterator.dapan1} ${iterator.dapan2} ${iterator.dapan3} ${iterator.dapan4}
        Hãy trả lời theo mẫu sau:
        Dịch sang tiếng Việt:
        Đáp án đúng:
        Các từ vựng quan trọng:
        `;

      const {
        data: { choices },
      } = await axios.post("http://localhost:8766/v1/chat/completions", {
        messages,
        model: "GPT-3.5",
      });

      lastData.push({
        ...iterator,
        chatgpt: choices,
      });

      //  RESULT FILENAME
      fs.writeFileSync(RESULT_TMP_FILENAME, JSON.stringify(lastData));
      console.log("DONE-----", index);
      await sleep(10000);
    }
  } catch (error) {
    console.error(error);
  } finally {
    const objectToCsv = new ObjectsToCsv(result);
    await objectToCsv.toDisk(RESULT_FILENAME);
  }
};

// data processing
const dataToCSV = async () => {
  const data = JSON.parse(fs.readFileSync(RESULT_TMP_FILENAME));
  const result = [];

  for (const iterator of data) {
    result.push({
      ...iterator,
      chatgpt: iterator.chatgpt[0].message.content.replaceAll("\n", "<br/>"),
    });
  }

  const objectToCsv = new ObjectsToCsv(result);
  await objectToCsv.toDisk(RESULT_FILENAME);
};

getData();

// dataToCSV();
