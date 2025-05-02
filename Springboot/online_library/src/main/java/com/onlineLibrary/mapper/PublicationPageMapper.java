package com.onlineLibrary.mapper;

import com.github.pagehelper.Page;
import com.onlineLibrary.DTO.PublicationDTO;
import com.onlineLibrary.DTO.PublicationVO;
import com.onlineLibrary.Entity.Publication;
import com.onlineLibrary.VO.BooksVO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PublicationPageMapper {

    /**
     * 查询期刊
     * @param publicationDTO
     * @return
     */
    Page<Publication> select(PublicationDTO publicationDTO);

    PublicationVO selectById(int id);


    /**
     * 插入单条期刊信息
     * @param publication
     */
    @Insert("INSERT INTO publications (title, doi, cited_count, publication_year, authors) " +
            "VALUES (#{title}, #{doi}, #{citedCount}, #{publicationYear}, #{authors})")
    void insert(Publication publication);
}