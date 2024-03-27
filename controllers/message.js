import MessageModel from "../models/MessageModel.js";

export const addMessage = async (req, res, next) => {
  const { senderId, text, chatId } = req.body;
  const message = new MessageModel({
    senderId,
    text,
    chatId,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMessage = async (req, res, next) => {
  const { chatId } = req.params;
  try {
    const messages = await MessageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
  }
};
