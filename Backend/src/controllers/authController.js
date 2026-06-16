import * as authService from "../services/authService.js";

export const login = async (req,res)=>
{
 try {
    const { email, password } = req.body;

    const result = await authService.login(
      email,
      password
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }

}