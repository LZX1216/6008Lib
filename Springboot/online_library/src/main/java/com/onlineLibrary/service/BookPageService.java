package com.onlineLibrary.service;

import com.onlineLibrary.DTO.BooksPageQueryDTO;
import com.onlineLibrary.DTO.CommentsDTO;
import com.onlineLibrary.VO.BooksVO;
import com.onlineLibrary.Entity.Comments;
import com.onlineLibrary.result.PageResult;

import java.util.List;

public interface BookPageService {

    /**
     * 插入评论及分数 更新
     * @param commentsDTO
     */
    void insertComments(CommentsDTO commentsDTO);


    /**
     * 计算均分
     * @param bookId
     * @return
     */
    Double getAverageRating(Integer bookId);

    /**
     * 更新均分到book表
     * @param bookId
     * @param averageRating
     */
    void updateRating(Integer bookId, Double averageRating);

    /**
     * 查询书籍
     * @param booksPageQueryDTO
     * @return
     */
    PageResult pageQuery(BooksPageQueryDTO booksPageQueryDTO);

    PageResult slideQuery(BooksPageQueryDTO booksPageQueryDTO);

    BooksVO BookQuery(Integer bookId);

    List<Comments> CommentQuery(Integer bookId);
}
