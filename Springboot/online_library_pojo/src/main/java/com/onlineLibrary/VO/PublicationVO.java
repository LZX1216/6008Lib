package com.onlineLibrary.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Year;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicationVO {

    private Integer id;
    private String authors;
    private String doi;
    private String title;
    private int citedCount;
    private Year publicationYear;
    //页码
}
