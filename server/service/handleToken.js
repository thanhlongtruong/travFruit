require("dotenv").config();
const fs = require("fs");

const handleSaveToken = (token, id) => {
  try {
    const tokens = JSON.parse(
      fs.readFileSync(process.env.PATH_FIFE_TOKEN, "utf8")
    );
  } catch (err) {
    // Nếu file chưa tồn tại, tạo file mới
    if (err.code === "ENOENT") {
      tokens = [];
    } else {
      throw err;
    }
  }
  const existingTokenIndex = tokens.findIndex((t) => t.username === username);
  if (existingTokenIndex === -1) {
    // Nếu chưa có token, thêm token mới vào mảng
    tokens.push(newToken);
  } else {
    // Nếu đã có token, cập nhật token mới
    tokens[existingTokenIndex] = newToken;
  }
  // Lưu mảng tokens vào file
  fs.writeFileSync(tokenFilePath, JSON.stringify(tokens));

  const data = { id, token };
  fs.writeFileSync(process.env.PATH_FIFE_TOKEN, data);
  console.log("Ghi token success !");
};
