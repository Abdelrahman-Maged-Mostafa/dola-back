const Room = require("../models/roomModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createNewRoom = catchAsync(async (req, res, next) => {
  req.body.createdAt = new Date();
  const newOne = await Room.create(req.body);
  await res.status(201).json({
    status: "success",
    data: { data: newOne },
  });
});

exports.getRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findOne({ name: req.body.name });
  if (!room)
    return next(
      new AppError(
        curUser.notActiveMessage ||
          "No Room by this Name azpot el Request ya 3l2",
        404,
      ),
    );

  if (room.password !== req.body.password)
    return next(
      new AppError(
        curUser.notActiveMessage || "Room mwgood pas el password 3lt ya 7mar",
        403,
      ),
    );

  await res.status(201).json({
    status: "success",
    data: { data: room },
  });
});

exports.addMessage = catchAsync(async (req, res, next) => {
  req.body.createdAt = new Date();

  const room = await Room.findById(req.params.id);

  if (!room)
    return next(
      new AppError(
        curUser.notActiveMessage ||
          "No Room by this id azpot el Request ya 3l2",
        404,
      ),
    );
  const newMessage = {
    ownerName: req.body.name,
    message: req.body.message,
  };
  const room = await Room.findByIdAndUpdate(req.params.id, {
    messages: [...messages, newMessage],
  });

  await res.status(201).json({
    status: "success",
    data: { data: room },
  });
});
