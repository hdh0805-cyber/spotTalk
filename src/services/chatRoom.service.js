const pool = require('../config/db');
const placeRepository = require('../repositories/place.repository');
const chatRoomRepository = require('../repositories/chatRoom.repository');
const chatRoomMemberRepository = require('../repositories/chatRoomMember.repository');

const createRoom = async (mi_seq, {
    pi_seq,
    cr_name,
    cr_expire_kind,
    lat,
    lng,
}) => {
    if (!pi_seq || !cr_name || !lat || !lng) {
        const error = new Error('장소, 방 제목, 위도, 경도는 필수입니다.');
        error.statusCode = 400;
        throw error;
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
        const error = new Error('위도와 경도 형식이 올바르지 않습니다.');
        error.statusCode = 400;
        throw error;
    }

    if (cr_expire_kind && !['1', '2'].includes(cr_expire_kind)) {
        const error = new Error('방 해체 조건은 1 또는 2만 가능합니다.');
        error.statusCode = 400;
        throw error;
    }

    const place = await placeRepository.findActivePlaceBySeq({
        pi_seq,
        lat: latNum,
        lng: lngNum,
    });

    if (!place) {
        const error = new Error('사용 가능한 장소를 찾을 수 없습니다.');
        error.statusCode = 404;
        throw error;
    }

    if (!place.is_inside) {
        const error = new Error('현재 위치가 장소 허용 반경 밖입니다.');
        error.statusCode = 403;
        throw error;
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const room = await chatRoomRepository.createChatRoom(client, {
            cr_name,
            cr_pi_seq: pi_seq,
            cr_mi_seq: mi_seq,
            cr_expire_kind: cr_expire_kind || '1',
        });

        const member = await chatRoomMemberRepository.createRoomOwner(client, {
            crm_cr_seq: room.cr_seq,
            crm_mi_seq: mi_seq,
        });

        await client.query('COMMIT');

        return {
            room,
            member,
            place: {
                pi_seq: place.pi_seq,
                pi_name: place.pi_name,
                distance_m: Number(place.distance_m),
                pi_radius_m: place.pi_radius_m,
            },
        };

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const getNearbyRooms = async ({ lat, lng }) => {
    if (!lat || !lng) {
        const error = new Error('위도와 경도는 필수입니다.');
        error.statusCode = 400;
        throw error;
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
        const error = new Error('위도와 경도 형식이 올바르지 않습니다.');
        error.statusCode = 400;
        throw error;
    }

    const rooms = await chatRoomRepository.findNearbyRooms({
        lat: latNum,
        lng: lngNum,
    });

    return {
        rooms: rooms.map((room) => ({
            cr_seq: room.cr_seq,
            cr_name: room.cr_name,
            cr_pi_seq: room.cr_pi_seq,
            cr_use: room.cr_use,
            cr_regdt: room.cr_regdt,
            cr_mi_seq: room.cr_mi_seq,
            cr_expire_kind: room.cr_expire_kind,
            place: {
                pi_name: room.pi_name,
                pi_radius_m: room.pi_radius_m,
                distance_m: Number(room.distance_m),
            },
            category: {
                pc_seq: room.pc_seq,
                pc_name: room.pc_name,
            },
            member_count: Number(room.member_count),
        })),
    };
};

const getRoomDetail = async (mi_seq, { cr_seq }) => {
    if (!cr_seq) {
        const error = new Error('채팅방 고유키는 필수입니다.');
        error.statusCode = 400;
        throw error;
    }

    const room = await chatRoomRepository.findRoomDetailBySeq({
        cr_seq,
        mi_seq,
    });

    if (!room) {
        const error = new Error('채팅방 정보를 찾을 수 없습니다.');
        error.statusCode = 404;
        throw error;
    }

    return {
        room: {
            cr_seq: room.cr_seq,
            cr_name: room.cr_name,
            cr_pi_seq: room.cr_pi_seq,
            cr_use: room.cr_use,
            cr_regdt: room.cr_regdt,
            cr_mi_seq: room.cr_mi_seq,
            cr_expire_kind: room.cr_expire_kind,
            place: {
                pi_name: room.pi_name,
                pi_radius_m: room.pi_radius_m,
            },
            category: {
                pc_seq: room.pc_seq,
                pc_name: room.pc_name,
            },
            owner: {
                mi_seq: room.owner_mi_seq,
                mi_id: room.owner_mi_id,
                mi_name: room.owner_mi_name,
                mi_nick: room.owner_mi_nick,
            },
            member_count: Number(room.member_count),
            my_status: {
                crm_state: room.my_state || 'N',
                crm_admin: room.my_admin || 'N',
                crm_expel: room.my_expel || 'N',
                crm_join_dt: room.my_join_dt || null,
                crm_leave_dt: room.my_leave_dt || null,
                is_joined: room.my_state === 'Y' && room.my_expel !== 'Y' ? 'Y' : 'N',
                is_owner: room.my_admin === 'Y' ? 'Y' : 'N',
                is_expelled: room.my_expel === 'Y' ? 'Y' : 'N',
            },
        },
    };
};

const joinRoom = async (mi_seq, { cr_seq, lat, lng }) => {
    if (!cr_seq) {
        const error = new Error('채팅방 고유키는 필수입니다.');
        error.statusCode = 400;
        throw error;
    }

    if (!lat || !lng) {
        const error = new Error('위도와 경도는 필수입니다.');
        error.statusCode = 400;
        throw error;
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
        const error = new Error('위도와 경도 형식이 올바르지 않습니다.');
        error.statusCode = 400;
        throw error;
    }

    const room = await chatRoomRepository.findRoomAccessInfo({
        cr_seq,
        lat: latNum,
        lng: lngNum,
    });

    if (!room) {
        const error = new Error('입장 가능한 채팅방을 찾을 수 없습니다.');
        error.statusCode = 404;
        throw error;
    }

    if (!room.is_inside) {
        const error = new Error('현재 위치가 장소 허용 반경 밖입니다.');
        error.statusCode = 403;
        throw error;
    }

    const existsMember = await chatRoomMemberRepository.findRoomMember({
        crm_cr_seq: cr_seq,
        crm_mi_seq: mi_seq,
    });

    if (existsMember && existsMember.crm_expel === 'Y') {
        const error = new Error('강퇴당한 방은 입장 불가 합니다.');
        error.statusCode = 403;
        throw error;
    }

    const member = await chatRoomMemberRepository.joinRoomMember({
        crm_cr_seq: cr_seq,
        crm_mi_seq: mi_seq,
    });

    if (!member) {
        const error = new Error('채팅방 입장 처리에 실패했습니다.');
        error.statusCode = 500;
        throw error;
    }

    return {
        room: {
            cr_seq: room.cr_seq,
            cr_name: room.cr_name,
            cr_pi_seq: room.cr_pi_seq,
            place: {
                pi_seq: room.pi_seq,
                pi_name: room.pi_name,
                distance_m: Number(room.distance_m),
                pi_radius_m: room.pi_radius_m,
            },
        },
        member,
    };
};

const leaveRoom = async (mi_seq, { cr_seq }) => {
    if (!cr_seq) {
        const error = new Error('채팅방 고유키는 필수입니다.');
        error.statusCode = 400;
        throw error;
    }

    const existsMember = await chatRoomMemberRepository.findRoomMember({
        crm_cr_seq: cr_seq,
        crm_mi_seq: mi_seq,
    });

    if (!existsMember) {
        const error = new Error('채팅방 참여 정보를 찾을 수 없습니다.');
        error.statusCode = 404;
        throw error;
    }

    if (existsMember.crm_state !== 'Y') {
        const error = new Error('이미 나간 채팅방입니다.');
        error.statusCode = 400;
        throw error;
    }

    const member = await chatRoomMemberRepository.leaveRoomMember({
        crm_cr_seq: cr_seq,
        crm_mi_seq: mi_seq,
    });

    if (!member) {
        const error = new Error('채팅방 나가기 처리에 실패했습니다.');
        error.statusCode = 500;
        throw error;
    }

    return {
        member,
    };
};

module.exports = {
    createRoom,
    getNearbyRooms,    
    getRoomDetail,
    joinRoom,
    leaveRoom,
};