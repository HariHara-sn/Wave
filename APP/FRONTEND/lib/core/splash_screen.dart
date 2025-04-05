import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:learnpro/core/controllers/session_controller.dart';
import 'package:learnpro/feature/auth/presentation/pages/GettingStarted%20page.dart';
import 'package:learnpro/feature/landing_page.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  final SessionController sessionController = Get.find<SessionController>();
  bool _hasNavigated = false;

  @override
  void initState() {
    super.initState();

    ever(sessionController.isLoggedIn, (isLoggedIn) {
      if (_hasNavigated) return;
      _hasNavigated = true;
      if (isLoggedIn) {
        debugPrint("Navigating to LandingPage");
        Get.offAll(() => LandingPage(),
            transition: Transition.rightToLeft,
            duration: Duration(milliseconds: 600));
      } else {
        debugPrint("Navigating to LoginPage");
        Get.offAll(() => GetStartedPage(),
            transition: Transition.rightToLeft,
            duration: Duration(milliseconds: 600));
      }
    });

    Future.delayed(const Duration(seconds: 2), () {
      sessionController.isLoggedIn.refresh();
    });
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final bool isDarkMode = theme.brightness == Brightness.dark;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          color: isDarkMode ? Colors.black : Colors.white,
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TweenAnimationBuilder(
                tween: Tween<double>(begin: 0.5, end: 1.0),
                duration: const Duration(seconds: 1),
                builder: (context, double scale, child) {
                  return Transform.scale(
                    scale: scale,
                    child: Icon(
                      Icons.school,
                      size: 100,
                      color: isDarkMode ? Colors.white : Colors.black,
                    ),
                  );
                },
              ),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: "Learn Pro ".split(" ").asMap().entries.map((entry) {
                  int index = entry.key;
                  String word = entry.value;

                  return TweenAnimationBuilder(
                    tween: Tween<double>(begin: 0.0, end: 1.0),
                    duration: Duration(milliseconds: 300 + (index * 200)),
                    builder: (context, double opacity, child) {
                      return Opacity(
                        opacity: opacity,
                        child: Transform.scale(
                          scale: opacity,
                          child: Text(
                            word,
                            style: GoogleFonts.orbitron(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: isDarkMode ? Colors.white : Colors.black,
                              letterSpacing: 1.5,
                            ),
                          ),
                        ),
                      );
                    },
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
