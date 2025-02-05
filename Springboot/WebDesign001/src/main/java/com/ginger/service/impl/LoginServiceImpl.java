package com.ginger.service.impl;

import com.ginger.mapper.UserMapper;
import com.ginger.pojo.User;
import com.ginger.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public User login(User user){
        return userMapper.select(user.getUsername(), user.getPassword());
    }
    public User login(String username, String password){
        return userMapper.select(username, password);
    }


    @Override
    public User selectByUsername(User user) {
        return userMapper.selectByCondition(user.getUsername());
    }
    public User selectByUsername(String username) {
        return userMapper.selectByCondition(username);
    }

    @Override
    public void register(User user) {
        userMapper.add(user);
    }

    @Override
    public Integer countAll(){return userMapper.countAll();
    };


}
