const chatRoomService = require('../services/chatRoom.service');
const { success } = require('../utils/response');

const create = async (req, res) => {
    const result = await chatRoomService.createRoom(req.user.mi_seq, req.body);

    return success(res, result, '채팅방 생성 성공');
};

const nearby = async (req, res) => {
    const result = await chatRoomService.getNearbyRooms(req.query);

    return success(res, result, '주변 채팅방 목록 조회 성공');
};

const detail = async (req, res) => {
    const result = await chatRoomService.getRoomDetail(req.user.mi_seq, req.params);

    return success(res, result, '채팅방 상세 조회 성공');
};

const join = async (req, res) => {
    const result = await chatRoomService.joinRoom(req.user.mi_seq, {
        cr_seq: req.params.cr_seq,
        ...req.body,
    });

    return success(res, result, '채팅방 입장 성공');
};

const leave = async (req, res) => {
    const result = await chatRoomService.leaveRoom(req.user.mi_seq, req.params);

    return success(res, result, '채팅방 나가기 성공');
};

module.exports = {
    create,
    nearby,
    detail,
    join,
    leave,
};