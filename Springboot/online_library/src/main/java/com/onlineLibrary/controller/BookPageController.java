package com.onlineLibrary.controller;


import com.onlineLibrary.DTO.BooksPageQueryDTO;
import com.onlineLibrary.DTO.CommentsDTO;
import com.onlineLibrary.VO.BooksVO;
import com.onlineLibrary.Entity.Comments;
import com.onlineLibrary.result.PageResult;
import com.onlineLibrary.result.Result;
import com.onlineLibrary.service.BookPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book")
@CrossOrigin()
public class BookPageController {

    @Autowired
    private BookPageService bookPageService;
    /**
     * 插入评论及打分 并更新
     * @param commentsDTO
     * @return
     */
    @PostMapping("/submitComment")
    @CrossOrigin()
    public Result insertComments(@RequestBody CommentsDTO commentsDTO){
        //插入评论
        bookPageService.insertComments(commentsDTO);
        // 获取最新的书籍评分平均值 返回给前端
        Double averageRating = bookPageService.getAverageRating(commentsDTO.getBookId());
        //更新rating到book表
        bookPageService.updateRating(commentsDTO.getBookId(),averageRating);
        return Result.success(averageRating);
    }

    @GetMapping("/id/{id}")
    @CrossOrigin()
    public BooksVO BookQuery(@PathVariable("id") Integer id)
    {

        BooksVO booksVO;
        booksVO = bookPageService.BookQuery(id);

        return booksVO;
    }

    /**
     * 条件查询书籍并分页展示
     * @param booksPageQueryDTO
     * @return
     */
    @GetMapping("/page")
    @CrossOrigin()
    public Result<PageResult> pageQuery(BooksPageQueryDTO booksPageQueryDTO){
        PageResult pageResult = bookPageService.pageQuery(booksPageQueryDTO);
        return Result.success(pageResult);
    }
    //查询
    @GetMapping ("/sildeQuery")
    @CrossOrigin()
    public Result<PageResult> slideQuery(BooksPageQueryDTO booksPageQueryDTO){
        PageResult pageResult = bookPageService.slideQuery(booksPageQueryDTO);
        return Result.success(pageResult);
    }

    @GetMapping("/comment/{id}")
    @CrossOrigin()
    public List<Comments> CommentQuery(@PathVariable("id") Integer id)
    {
        List<Comments> Bookcomments = bookPageService.CommentQuery(id);

        return Bookcomments;
    }
}
