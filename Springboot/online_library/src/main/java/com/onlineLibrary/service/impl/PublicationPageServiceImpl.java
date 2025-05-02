package com.onlineLibrary.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.onlineLibrary.DTO.PublicationDTO;
import com.onlineLibrary.DTO.PublicationVO;
import com.onlineLibrary.Entity.Publication;
import com.onlineLibrary.VO.BooksVO;
import com.onlineLibrary.mapper.PublicationPageMapper;
import com.onlineLibrary.result.PageResult;
import com.onlineLibrary.service.PublicationPageService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
//TODO
@Service
public class PublicationPageServiceImpl implements PublicationPageService {
    @Autowired
    private PublicationPageMapper publicationPageMapper;

    @Transactional
    @Override
    public void savePublication(PublicationDTO publicationDTO) {
        com.onlineLibrary.Entity.Publication publication = new Publication();
        BeanUtils.copyProperties(publicationDTO, publication);
        publicationPageMapper.insert(publication);
    }

    @Override
    public PageResult pageQuery(PublicationDTO publicationDTO) {
        //设置分页参数
        PageHelper.startPage(publicationDTO.getPage(), publicationDTO.getPageSize());
        //调用Mapper查数据
        Page<Publication> page = publicationPageMapper.select(publicationDTO);

        //数据封装
        long total = page.getTotal();
        List<Publication> records = page.getResult();
        //返回
        return new PageResult(total, records);
    }

    @Override
    public PublicationVO PaperQuery(Integer paperId) {
        PublicationVO publicationVO = publicationPageMapper.selectById(paperId);

        return publicationVO;
    }

}
