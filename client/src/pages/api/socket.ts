import {
  EVENTS,
  MESSAGES,
  DEFAULT_ROUND,
  DEFAULT_CURRENT,
} from "@utils/common/constants";
import { Server } from "socket.io";
import { deepClone } from "@utils/common/helpers";
import connectMongo from "@utils/api/mongodb/mongodb";
import Desk from "@utils/api/mongodb/models/desk.model";
import { NOT_FOUND } from "@utils/api/mongodb/constants";
import { DocumentDeskType } from "@utils/api/mongodb/types";
import { DeskType, PLAYER_STATUS } from "@utils/common/types";

export default function SocketHandler(_: any, res: any) {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket_io",
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on("connection", async (socket) => {
    console.warn("Connected", socket.id);

    await connectMongo();

    socket.on(
      MESSAGES.JOIN_DESK,
      async ({ desk, name }: { desk: string; name: string }) => {
        handleJoinDesk({ desk, name });
      }
    );

    socket.on(MESSAGES.START_GAME, (desk: DeskType) => {
      handleStartGame(desk);
    });

    socket.on(MESSAGES.START_THROW_DICE, (desk: DeskType) => {
      handleStartThrowDice(desk);
    });

    socket.on(MESSAGES.THROW_DICE, (desk: DeskType) => {
      handleThrowDice(desk);
    });

    socket.on(MESSAGES.FINISH_THROW_DICE, (desk: DeskType) => {
      handleFinishThrowDice(desk);
    });

    socket.on(MESSAGES.SELECT_DICE, (desk: DeskType) => {
      handleSelectDice(desk);
    });

    socket.on(MESSAGES.CLOSE_CONCLUSION, (desk: DeskType) => {
      handleCloseConclusion(desk);
    });

    socket.on(MESSAGES.END_GAME, (desk: DeskType) => {
      handleEndGame(desk);
    });

    socket.on(MESSAGES.CHANGE_SETTINGS, (desk: DeskType) => {
      handleChangeSettings(desk);
    });

    socket.on(MESSAGES.LEAVE_DESK, () => {
      handleLeaveDesk();
    });

    socket.on("disconnect", () => {
      handleLeaveDesk();
      console.warn(`Disconected: ID: ${socket.id}; ROOM: ${socket.data.room}`);
    });

    const handleJoinDesk = async ({
      desk,
      name,
    }: {
      desk: string;
      name: string;
    }) => {
      console.log(desk, name);
      socket.join(desk);
      socket.data.room = desk;

      const updatedDesk = await Desk.findOneAndUpdate(
        { _id: desk },
        {
          $push: {
            "gameplay.players": {
              name,
              id: socket.id,
              status: PLAYER_STATUS.ONLINE,
            },
          },
        },
        { new: true }
      );

      io.to(desk).emit(EVENTS.ON_JOIN_DESK, getMessageBody(updatedDesk));
    };

    const handleStartGame = async (desk: DeskType) => {
      const updatedDesk = await Desk.findOneAndUpdate(
        { _id: desk },
        { $set: { gameplay: desk.gameplay } },
        { new: true }
      );

      if (desk._id) {
        io.to(desk._id).emit(EVENTS.ON_START_GAME, getMessageBody(updatedDesk));
      }
    };

    const handleStartThrowDice = async (desk: DeskType) => {
      const updatedDesk = await Desk.findOneAndUpdate(
        { _id: desk._id },
        { $set: { gameplay: desk.gameplay } },
        { new: true }
      );

      if (desk._id) {
        io.to(desk._id).emit(
          EVENTS.ON_START_THROW_DICE,
          getMessageBody(updatedDesk)
        );
      }
    };

    const handleThrowDice = async (desk: DeskType) => {
      const updatedDesk = await Desk.findOneAndUpdate(
        { _id: desk._id },
        { $set: { gameplay: desk.gameplay } },
        { new: true }
      );

      if (desk._id) {
        io.to(desk._id).emit(EVENTS.ON_THROW_DICE, getMessageBody(updatedDesk));
      }
    };

    const handleFinishThrowDice = async (desk: DeskType) => {
      const updatedDesk = await Desk.findOneAndUpdate(
        { _id: desk._id },
        { $set: { gameplay: desk.gameplay } },
        { new: true }
      );

      if (!updatedDesk) {
        return;
      }

      io.to(updatedDesk.id).emit(
        EVENTS.ON_FINISH_THROW_DICE,
        getMessageBody(updatedDesk)
      );

      if (
        updatedDesk.gameplay.rounds[updatedDesk.gameplay.current.round]
          .isCompleted
      ) {
        handleFinishStageAfterCloseConclusion(updatedDesk);
      }
    };

    const handleSelectDice = async (desk: DeskType) => {
      const updatedDesk = await Desk.findOneAndUpdate(
        { _id: desk._id },
        { $set: { gameplay: desk.gameplay } },
        { new: true }
      );

      if (updatedDesk) {
        io.to(updatedDesk.id).emit(
          EVENTS.ON_SELECT_DICE,
          getMessageBody(updatedDesk)
        );
      }
    };

    const handleCloseConclusion = async (desk: DeskType) => {
      const updatedDesk = await Desk.findOneAndUpdate(
        { _id: desk._id },
        { $set: { gameplay: desk.gameplay } },
        { new: true }
      );

      setTimeout(() => {
        if (!updatedDesk) {
          return;
        }

        if (updatedDesk.gameplay.isLastRound) {
          handleEndGameAfterCloseConclusion(updatedDesk);
        } else {
          io.to(updatedDesk.id).emit(
            EVENTS.ON_CLOSE_CONCLUSION,
            getMessageBody(updatedDesk)
          );
        }
      }, 5000);
    };

    const handleEndGame = async (desk: DeskType) => {
      const updatedDesk = await Desk.findOneAndUpdate(
        { _id: desk._id },
        { $set: { gameplay: desk.gameplay } },
        { new: true }
      );

      if (desk._id) {
        io.to(desk._id).emit(EVENTS.ON_END_GAME, getMessageBody(updatedDesk));
      }
    };

    const handleChangeSettings = async (desk: DeskType) => {
      const updatedDesk = await Desk.findOneAndUpdate(
        { _id: desk._id },
        { $set: { gameplay: desk.gameplay } },
        { new: true }
      );

      if (desk._id) {
        io.to(desk._id).emit(
          EVENTS.ON_CHANGE_SETTINGS,
          getMessageBody(updatedDesk)
        );
      }
    };

    const handleLeaveDesk = async () => {
      const room = socket.data.room;

      socket.leave(room);

      const desk = await Desk.findById(room);

      let updatedDesk;

      if (desk?.gameplay.isGameStarted) {
        updatedDesk = await Desk.findOneAndUpdate(
          { _id: room, "gameplay.players.id": socket.id },
          { $set: { "gameplay.players.$.status": PLAYER_STATUS.OFFLINE } },
          { new: true }
        );
      } else {
        updatedDesk = await Desk.findOneAndUpdate(
          { _id: room },
          { $pull: { "gameplay.players": { id: socket.id } } },
          { new: true }
        );
      }

      socket.to(room).emit(EVENTS.ON_LEAVE_DESK, getMessageBody(updatedDesk));
    };

    const handleFinishStageAfterCloseConclusion = (
      updatedDesk: DocumentDeskType
    ) => {
      handleCloseConclusion({
        ...updatedDesk,
        _id: updatedDesk._id.toString(),
        gameplay: {
          ...updatedDesk.gameplay,
          isShowConclusion: false,
          rounds: [...updatedDesk.gameplay.rounds, deepClone(DEFAULT_ROUND)],
          current: {
            ...updatedDesk.gameplay.current,
            round: updatedDesk.gameplay.current.round + 1,
            stage: 0,
          },
        },
      });
    };

    const handleEndGameAfterCloseConclusion = (
      updatedDesk: DocumentDeskType
    ) => {
      handleEndGame({
        ...updatedDesk,
        _id: updatedDesk._id.toString(),
        gameplay: {
          ...updatedDesk.gameplay,
          isLastRound: false,
          isGameEnded: false,
          isGameStarted: false,
          isShowConclusion: false,
          rounds: [deepClone(DEFAULT_ROUND)],
          current: deepClone(DEFAULT_CURRENT),
        },
      });
    };

    const getMessageBody = (body: any) => {
      if (body) {
        return body;
      } else {
        return NOT_FOUND;
      }
    };
  });

  console.log("Setting up socket");
  res.end();
}
