package com.onlineLibrary.VO;

import lombok.Data;

@Data

public class LoginVO {

    private Integer id;
    private String username;
    private String name;
    private String token;
    private Integer role;

    // 无参构造函数
    public LoginVO() {
    }

    // 带参构造函数
    public LoginVO(Integer id, String username, String name, String token, Integer role) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.token = token;
        this.role = role;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }
}
