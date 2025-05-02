package com.onlineLibrary.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Year;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicationDTO {

    private Integer id;


    private String authors;
    private String doi;
    private String title;
    private int citedCount;
    private Year publicationYear;
    private int citedCountRange0;
    private int citedCountRange1;
    private LocalDate yearRange0;
    private LocalDate yearRange1;
    //页码
    private int page;
    //每页显示记录数
    private int pageSize;

    public Year getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(Year publicationYear) {
        this.publicationYear = publicationYear;
    }

    public String getAuthors() {
        return authors;
    }

    public void setAuthors(String authors) {
        this.authors = authors;
    }
}

