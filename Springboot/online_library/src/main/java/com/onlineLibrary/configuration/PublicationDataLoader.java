package com.onlineLibrary.configuration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onlineLibrary.DTO.PublicationDTO;
import com.onlineLibrary.service.PublicationPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Year;

@Component
public class PublicationDataLoader {

    private final RestTemplate restTemplate;
    private final PublicationPageService publicationPageService;

    @Autowired
    public PublicationDataLoader(RestTemplate restTemplate, PublicationPageService publicationPageService) {
        this.restTemplate = restTemplate;
        this.publicationPageService = publicationPageService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void loadRecentPapersOnStartup() {
        String url = "https://api.openalex.org/works"
                + "?sort=cited_by_count:desc"
                + "&select=title,authorships,publication_year,cited_by_count,doi"
                + "&per-page=200"
                +"&filter=from_publication_date:2000-12-01,to_publication_date:2020-04-30";

        // 调用 OpenAlex API，直接获取 String 类型的响应
        String json = restTemplate.getForObject(url, String.class);
        System.out.println("OpenAlex API Response: " + json);

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

                    publicationPageService.savePublication(dto);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to parse API response");
        }
    }
}