import 'package:learnpro/core/core.dart';

class AuthUrl {
  static final String GetOTP = '${learnproCore.baseUrl}/auth/GenerateOTP';
  static final String AuthenticateOTP = '${learnproCore.baseUrl}/auth/authOTP';
  static final String GoogleSignIN =
      '${learnproCore.baseUrl}/auth/googleSignIN';
  static final String AppleSignIN = '${learnproCore.baseUrl}/auth/AppleSignIN';
}
