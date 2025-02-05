package com.ginger.service;

import com.ginger.pojo.User;

public interface LoginService {
     User login(User user);


     User selectByUsername(User user);

     User selectByUsername(String username);

     Integer countAll();


     void register(User user);


     User login(String username, String password);
}


