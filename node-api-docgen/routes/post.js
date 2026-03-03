const express = require('express');
const router = express.Router();

// 임시 게시글 데이터 구조
const mockPosts = [
  {
    id: 1,
    title: "첫 번째 테스트 게시글",
    content: "API 문서화 도구 추출 테스트를 위한 본문입니다.",
    author: "재혁",
    createdAt: "2026-03-03T09:00:00Z",
    comments: [
      { id: 101, author: "user1", text: "기대되는 프로젝트입니다." },
      { id: 102, author: "user2", text: "AST 파싱은 어떻게 진행되나요?" }
    ]
  },
  {
    id: 2,
    title: "라우트 계층화 작업 완료",
    content: "Express 라우터 계층화 테스트용 데이터입니다.",
    author: "재혁",
    createdAt: "2026-03-03T10:00:00Z",
    comments: []
  }
];

// GET /posts - 전체 게시글 목록 조회
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockPosts,
    totalCount: mockPosts.length
  });
});

// GET /posts/:id - 특정 게시글 상세 조회
router.get('/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = mockPosts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "게시글을 찾을 수 없습니다."
    });
  }

  res.json({
    success: true,
    data: post
  });
});

module.exports = router;