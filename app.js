const express = require("express");
const bodyParser = require("body-parser");
const { Item, Status, Type, History, Color } = require("./models");
const { Op } = require("sequelize");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const sequelize = require("./config/database");
require("./models");
sequelize.sync({
  alter: true,
});

app.get("/content", async (req, res) => {
  const getItem = await Item.findAll({
    include: [
      {
        model: Status,
        attributes: ["name"],
      },
      {
        model: Type,
        attributes: ["name"],
      },
    ],
    order: [[Status, "id", "ASC"]],
  });

  return res.status(200).json({ success: true, data: getItem });
});

app.get("/content/search", async (req, res) => {
  const { content } = req.query;

  const getItem = await Item.findAll({
    where: {
      [Op.or]: [
        {
          content: {
            [Op.like]: "%" + content + "%",
          },
        },
      ],
    },
    include: [
      {
        model: Status,
        attributes: ["name"],
      },
      {
        model: Type,
        attributes: ["name"],
      },
    ],
    order: [[Status, "id", "ASC"]],
  });

  return res.status(200).json({ success: true, data: getItem });
});

app.post("/content", async (req, res) => {
  try {
    const { content, statusId, typeId } = req.body;

    if (!content || !statusId || !typeId) {
      return res
        .status(400)
        .json({ error: "모든 필수 입력 값을 입력해주세요!" });
    }

    const newItem = await sequelize.transaction(async () => {
      await Item.create({
        content,
        statusId: parseInt(statusId),
        typeId: parseInt(typeId),
      });

      return await Item.findAll({
        include: [
          {
            model: Status,
            attributes: ["name"],
          },
          {
            model: Type,
            attributes: ["name"],
          },
        ],
        order: [[Status, "id", "ASC"]],
      });
    });

    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error("에러 발생:", error);
    return res.status(500).json({ error: "서버 오류 발생!" });
  }
});

app.put("/content", async (req, res) => {
  const { id, content, statusId, typeId } = req.body;

  if (!id || !content || !statusId || !typeId) {
    return res.status(400).json({ error: "모든 필수 입력 값을 입력해주세요!" });
  }

  const updateItem = await sequelize.transaction(async () => {
    const findItem = await Item.findByPk(id);

    const insertHistory = await History.create({
      content: findItem.dataValues.content,
      statusId: findItem.dataValues.statusId,
      typeId: findItem.dataValues.typeId,
      itemId: id,
    });

    if (!insertHistory) {
      return res.status(400).json({ error: "백업에 실패했습니다!" });
    }

    const [updatedRowsCount, updatedRows] = await Item.update(
      {
        content: content,
        statusId: statusId,
        typeId: typeId,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updatedRowsCount > 0) {
      return await Item.findAll({
        include: [
          {
            model: Status,
            attributes: ["name"],
          },
          {
            model: Type,
            attributes: ["name"],
          },
        ],
        order: [[Status, "id", "ASC"]],
      });
    } else {
      console.log("수정 실패.");
      res.status(404).json({ error: "해당 ID를 찾을 수 없습니다." });
    }
  });

  res.status(200).json({ success: true, data: updateItem });
});

app.delete("/content", async (req, res) => {
  const { ids } = req.body;

  if (!ids) {
    return res.status(400).json({ error: "삭제대상이 없습니다!" });
  }

  const deleteItem = await sequelize.transaction(async () => {
    try {
      for (const id of ids) {
        await Item.destroy({ where: { id: id } });
        await History.destroy({ where: { itemId: id } });
      }

      return await Item.findAll({
        include: [
          {
            model: Status,
            attributes: ["name"],
          },
          {
            model: Type,
            attributes: ["name"],
          },
        ],
        order: [[Status, "id", "ASC"]],
      });
    } catch (error) {
      console.error("삭제실패 :", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete items." });
    }
  });

  return res.status(200).json({ success: true, data: deleteItem });
});

app.get("/color", async (req, res) => {
  const getColor = await Color.findOne({
    order: [["id", "DESC"]],
  });

  return res.status(200).json({ success: true, data: getColor });
});

app.post("/color", async (req, res) => {
  try {
    const { red, green, blue, alpha } = req.body;
    console.log(red, green, blue, alpha);
    if (!red || !green || !blue || !alpha) {
      return res.status(400).json({ error: "잘못된 색상값 입니다!" });
    }

    const newItem = await sequelize.transaction(async () => {
      await Color.create({
        red,
        green,
        blue,
        alpha,
      });
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("에러 발생:", error);
    return res.status(500).json({ error: "서버 오류 발생!" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
