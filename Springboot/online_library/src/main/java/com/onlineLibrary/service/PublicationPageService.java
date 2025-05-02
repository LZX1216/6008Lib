package com.onlineLibrary.service;

import com.onlineLibrary.DTO.BooksPageQueryDTO;
import com.onlineLibrary.DTO.PublicationDTO;
import com.onlineLibrary.DTO.PublicationVO;
import com.onlineLibrary.VO.BooksVO;
import com.onlineLibrary.result.PageResult;
import org.springframework.transaction.annotation.Transactional;

public interface PublicationPageService {
    //TODO

    @Transactional
    void savePublication(PublicationDTO publicationDTO);

    /**
     * 查询书籍
     * @param publicationDTO
     * @return
     */
    PageResult pageQuery(PublicationDTO publicationDTO);

    PublicationVO PaperQuery(Integer bookId);

}