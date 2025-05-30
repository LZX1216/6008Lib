package com.onlineLibrary.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Books {

        //默认值
        public static final  Double  initial_rating = 0.0;
        public static final  Integer numberOfTotalcopies =20;
        public static final  Integer initial_available_copies = 20;
        public static final  Integer initial_available = 1;
        public static final  String  initial_location = "Lee Wee Nam Library";

        private Integer id; // 图书ID
        private String title; // 书名
        private String author; // 作者
        private String publisher; // 出版社
        private String isbn; // ISBN

        @DateTimeFormat(pattern = "yyyy-MM-dd")
        private LocalDate publishDate; // 出版日期

        private String category; // 分类
        private String cover; // 图书封面
        private Double rating; // 评分
        private String description; // 内容简介
        private String location; // 馆藏位置
        private String callNumber; // 索书号
        private Integer availableCopies; // 在馆数量
        private Integer totalCopies; // 总藏书量
        private Integer available; // 是否可用

        private LocalDateTime createTime; // 创建时间
        private LocalDateTime updateTime; // 更新时间

        public Integer getId() {
                return id;
        }

        public void setId(Integer id) {
                this.id = id;
        }

        public String getTitle() {
                return title;
        }

        public void setTitle(String title) {
                this.title = title;
        }

        public String getAuthor() {
                return author;
        }

        public void setAuthor(String author) {
                this.author = author;
        }

        public String getPublisher() {
                return publisher;
        }

        public void setPublisher(String publisher) {
                this.publisher = publisher;
        }

        public String getIsbn() {
                return isbn;
        }

        public void setIsbn(String isbn) {
                this.isbn = isbn;
        }

        public LocalDate getPublishDate() {
                return publishDate;
        }

        public void setPublishDate(LocalDate publishDate) {
                this.publishDate = publishDate;
        }

        public String getCategory() {
                return category;
        }

        public void setCategory(String category) {
                this.category = category;
        }

        public String getCover() {
                return cover;
        }

        public void setCover(String cover) {
                this.cover = cover;
        }

        public Double getRating() {
                return rating;
        }

        public void setRating(Double rating) {
                this.rating = rating;
        }

        public String getDescription() {
                return description;
        }

        public void setDescription(String description) {
                this.description = description;
        }

        public String getLocation() {
                return location;
        }

        public void setLocation(String location) {
                this.location = location;
        }

        public String getCallNumber() {
                return callNumber;
        }

        public void setCallNumber(String callNumber) {
                this.callNumber = callNumber;
        }

        public Integer getAvailableCopies() {
                return availableCopies;
        }

        public void setAvailableCopies(Integer availableCopies) {
                this.availableCopies = availableCopies;
        }

        public Integer getTotalCopies() {
                return totalCopies;
        }

        public void setTotalCopies(Integer totalCopies) {
                this.totalCopies = totalCopies;
        }

        public Integer getAvailable() {
                return available;
        }

        public void setAvailable(Integer available) {
                this.available = available;
        }
}
