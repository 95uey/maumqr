import { ProfileWithMessages } from './types'

export const MOCK_PROFILE: ProfileWithMessages = {
  id: 'mock-uuid-1234',
  custom_id: 'minjun-barista',
  name: '김민준',
  role: '카페 바리스타',
  bio: '안녕하세요! 3년째 이 자리에서 커피를 내리고 있어요. 한 잔 한 잔 정성껏 만들겠습니다. 오늘도 좋은 하루 되세요 ☀️',
  photo_url: null,
  created_at: new Date().toISOString(),
  recent_messages: [
    {
      id: '1',
      text: '오늘 덕분에 기분 좋았어요',
      time_ago: '2시간 전',
    },
    {
      id: '2',
      text: '친절한 서비스 감사해요',
      time_ago: '어제',
    },
    {
      id: '3',
      text: '또 올게요',
      time_ago: '3일 전',
    },
  ],
}
