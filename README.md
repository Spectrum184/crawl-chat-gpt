# Hướng dẫn sử dụng

Phần này hiểu đơn giản là sẽ chạy 1 socket server để nhận dữ liệu từ script được nhúng thêm vào web của chat gpt. Script vẫn đang phát triển, chat gpt có thể thay đổi các chính sách nên có gì cứ liên hệ với mình.

## Các bước test chat gpt

- Cài đặt [Tempermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo). Đây là extentions để giúp ta có thể nhúng các script tự viết vào web site
- Cài đặt [CSP](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden). Việc nhúng script vào web site sau đó gửi thông tin đến server của mình tại local bị chrome block nên cần cài extentions này để block CSP của Chrome.
- Cài đặt yarn hoặc npm tuỳ vào sở thích, sau đó chạy `yarn` hoặc `npm install` để cài package
- Thêm script của tampermonkey từ file `.tampermonkey-script.js`
- Chạy server bằng câu lệnh `yarn start` hoặc `npm start`
- Mở web site [chat gpt](https://chat.openai.com/) nhớ bật 2 extentions vừa cài đặt bên trên sau đó nếu xuất hiện dòng API connected! như ảnh `.success.png` là được.
- Có thể test thử bằng cách gửi http POST request bằng postman tới địa chỉ như bên dưới để test câu trả lời.

http://localhost:8766/v1/chat/completions

```json
{
  "messages": "Tôi có câu hỏi: Tôi có đẹp trai không? Vui lòng trả lời theo mẫu: Tôi đẹp trai hay không: Đẹp trai thì có gì sai: Đẹp trai có kiếm được tiền không:",
  "model": "gpt-3.5"
}
```

Tuỳ vào câu trả lời mà chat gpt sẽ trả về phần div wrap câu hỏi khác nhau, phần này cần kiểm tra kĩ sau đó sửa phần PLEASE CHECK HERE ở file `.tampermonkey-script.js` để lấy được đúng data. Tham khảo ảnh `chat-gpt-answer.png` để biết cách lấy class name đúng.

## Chạy crawl câu hỏi

Trong file `.crawl-data-sempai.js` sẽ có 2 function chính `getData()` là function chạy cronjob duyệt qua data sau đó gửi request sang server đã kết nối với chat gpt. Còn lại function `dataToCSV()` dành để xử lý dữ liệu. Phần này mọi người có thể sửa tuỳ thích sao cho hợp lý đúng theo phần mong muốn.

- Copy file câu hỏi vào folder chính, nhớ copy file csv, đổi tên tuỳ thích nhưng nhớ đổi tên trùng với phần ``QUESTION_FILENAME`
- Chạy cronjob bằng lệnh `node crawl-data-sempai.js`. Sau khi lấy data xong có thể comment functions `getData()` sau đó chạy tiếp function `dataToCSV()`
