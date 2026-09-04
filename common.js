export const getRoomId = (userId1) => {
  const sortedIds = [userId1].sort();
  const roomId = sortedIds.join('_');
  return roomId;
}