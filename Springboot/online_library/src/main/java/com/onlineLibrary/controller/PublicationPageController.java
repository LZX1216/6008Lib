package com.onlineLibrary.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onlineLibrary.DTO.PublicationDTO;
import com.onlineLibrary.DTO.PublicationVO;
import com.onlineLibrary.VO.BooksVO;
import com.onlineLibrary.result.PageResult;
import com.onlineLibrary.result.Result;
import com.onlineLibrary.service.HomePageService;
import com.onlineLibrary.service.PublicationPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.time.Year;


import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/paper")
@CrossOrigin()
public class PublicationPageController {

    @Autowired
    private PublicationPageService publicationPageService;
    @Autowired
    private RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    /**
     * 条件查询书籍并分页展示
     * @param publicationDTO
     * @return
     */

    @GetMapping("/page")
    @CrossOrigin()
    public Result<PageResult> pageQuery(PublicationDTO publicationDTO){
        PageResult pageResult = publicationPageService.pageQuery(publicationDTO);
        return Result.success(pageResult);
    }

    @GetMapping("/id/{id}")
    @CrossOrigin()
    public PublicationVO PaperQuery(@PathVariable("id") Integer id)
    {

        PublicationVO publicationVO;
        publicationVO = publicationPageService.PaperQuery(id);

        return publicationVO;
    }


    /*
    @GetMapping("/recent-papers")
    public Result<?> getRecentPapers() {

        String url = "https://api.openalex.org/works"
                + "?sort=cited_by_count:desc"
                + "&select=title,authorships,publication_year,cited_by_count,doi"
                + "&per-page=10";


        // 调用 OpenAlex API
        Map response = restTemplate.getForObject(url, Map.class);
        //System.out.println("OpenAlex API Response: " + response);
        if (response != null) {
            return Result.success(response);
        } else {
            return Result.error("获取论文数据失败");
        }

    }
    */
    @CrossOrigin()
    @GetMapping("/recent-papers")
    public Result<List<PublicationDTO>> getRecentPapers() {
        String url = "https://api.openalex.org/works"
                + "?sort=cited_by_count:desc"
                + "&select=title,authorships,publication_year,cited_by_count,doi"
                + "&per-page=10";

        // 调用 OpenAlex API，直接获取 String 类型的响应
        String json = restTemplate.getForObject(url, String.class);
        System.out.println("OpenAlex API Response: " + json);

        List<PublicationDTO> publicationDTOList = new ArrayList<>();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(json);
            JsonNode resultsNode = rootNode.get("results");
            JsonNode metaNode = rootNode.get("meta");

            int page = metaNode.get("page").asInt();
            int pageSize = metaNode.get("per_page").asInt();

            if (resultsNode != null && resultsNode.isArray()) {
                for (JsonNode resultNode : resultsNode) {
                    String title = resultNode.get("title").asText();
                    String doi = resultNode.get("doi").asText();
                    int citedCount = resultNode.get("cited_by_count").asInt();
                    int publicationYearInt = resultNode.get("publication_year").asInt();
                    Year publicationYear = Year.of(publicationYearInt);

                    StringBuilder authorNames = new StringBuilder();
                    JsonNode authorshipsNode = resultNode.get("authorships");
                    if (authorshipsNode != null && authorshipsNode.isArray()) {
                        for (JsonNode authorshipNode : authorshipsNode) {
                            JsonNode authorNode = authorshipNode.get("author");
                            if (authorNode != null) {
                                String displayName = authorNode.get("display_name").asText();
                                if (authorNames.length() > 0) {
                                    authorNames.append(", ");
                                }
                                authorNames.append(displayName);
                            }
                        }
                    }
                    String author = authorNames.toString();

                    PublicationDTO dto = new PublicationDTO();
                    dto.setTitle(title);
                    dto.setDoi(doi);
                    dto.setCitedCount(citedCount);
                    dto.setPublicationYear(publicationYear);
                    dto.setAuthors(author);
                    dto.setPage(page);
                    dto.setPageSize(pageSize);

                    publicationDTOList.add(dto);
                    publicationPageService.savePublication(dto);


                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("Failed to parse API response");
        }

        return Result.success(publicationDTOList);
    }

}