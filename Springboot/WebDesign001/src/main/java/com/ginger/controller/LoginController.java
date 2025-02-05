package com.ginger.controller;

import com.ginger.pojo.Result;
import com.ginger.pojo.User;
import com.ginger.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController

public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    @CrossOrigin()
    public Result login(@RequestBody User user) {
           User user1 =  loginService.selectByUsername(user.getUsername());
           if (user1 == null) {
               return Result.error("40","用户不存在");
           }else{
                if (user1.getPassword().equals(user.getPassword())) {
                    return Result.success(user1,"登录成功！");
                }
                else return Result.error("41","密码错误");

           }
    }

    @PostMapping("/register")
    @CrossOrigin()
    public Result register(@RequestBody User user) {
        User user1 = loginService.selectByUsername(user);
        if (user1 != null) {
            System.out.println("username:"+user1.getUsername()+"is existed");
            return Result.error("12","username is existed");
        }else{
            user.setId(loginService.countAll());
            loginService.register(user);
            return Result.success(user);
        }
    }


    @RequestMapping("/")
    public String Test() {
        return "hello";
        }


}

