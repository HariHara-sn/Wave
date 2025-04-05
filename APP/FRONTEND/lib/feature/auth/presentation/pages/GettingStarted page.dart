import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:learnpro/feature/auth/presentation/pages/login_page.dart';
import 'package:google_fonts/google_fonts.dart';

class GetStartedPage extends StatefulWidget {
  const GetStartedPage({super.key});

  @override
  State<GetStartedPage> createState() => _GetStartedPageState();
}

class _GetStartedPageState extends State<GetStartedPage> {
  final PageController _pageController = PageController();
  int _currentPage = 0; // Track active page

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;
    final colorScheme = theme.colorScheme;
    final double screenHeight = MediaQuery.of(context).size.height;
    final double screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            PageView(
              controller: _pageController,
              onPageChanged: (index) {
                setState(() {
                  _currentPage = index;
                });
              },
              children: [
                _buildPage(
                  screenHeight,
                  screenWidth,
                  textTheme,
                  colorScheme,
                  "assets/Image/Ai.png",
                  "Discover",
                  "Explore a wide range of AI-driven learning resources tailored to your needs.",
                ),
                _buildPage(
                  screenHeight,
                  screenWidth,
                  textTheme,
                  colorScheme,
                  "assets/Image/Ai.png",
                  "Engage & Learn",
                  "Interact with AI-powered tutors and enhance your skills instantly.",
                ),
                _buildPage(
                  screenHeight,
                  screenWidth,
                  textTheme,
                  colorScheme,
                  "assets/Image/Ai.png",
                  "Track Progress",
                  "Monitor your learning journey and measure your growth in real-time.",
                ),
              ],
            ),
            Positioned(
              bottom: screenHeight * 0.12,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildDot(_currentPage == 0),
                  _buildDot(_currentPage == 1),
                  _buildDot(_currentPage == 2),
                ],
              ),
            ),
            Positioned(
              bottom: screenHeight * 0.05,
              right: screenWidth * 0.08,
              child: FloatingActionButton(
                onPressed: () {
                  if (_currentPage == 2) {
                    Get.offAll(() => LoginPage(),
                        transition: Transition.rightToLeft,
                        duration: const Duration(milliseconds: 500));
                  } else {
                    _pageController.nextPage(
                      duration: const Duration(milliseconds: 500),
                      curve: Curves.easeInOut,
                    );
                  }
                },
                backgroundColor: colorScheme.primary,
                child: Icon(
                  _currentPage == 2 ? Icons.check : Icons.arrow_forward,
                  color: colorScheme.onPrimary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPage(
      double screenHeight,
      double screenWidth,
      TextTheme textTheme,
      ColorScheme colorScheme,
      String imagePath,
      String title,
      String description) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          "LearnPro AI",
          style: GoogleFonts.ubuntu(
            fontSize: screenHeight * 0.05,
            fontWeight: FontWeight.bold,
            color: textTheme.headlineMedium?.color,
          ),
        ),
        SizedBox(height: screenHeight * 0.02),
        Image.asset(
          imagePath,
          height: screenHeight * 0.3,
        ),
        SizedBox(height: screenHeight * 0.04),
        Text(
          title,
          style: textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: screenHeight * 0.015),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: screenWidth * 0.1),
          child: Text(
            description,
            textAlign: TextAlign.center,
            style: textTheme.bodyMedium?.copyWith(
              color: textTheme.bodyMedium?.color?.withOpacity(0.7),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDot(bool isActive) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 5),
      width: isActive ? 10 : 8,
      height: isActive ? 10 : 8,
      decoration: BoxDecoration(
        color: isActive ? Colors.blueAccent : Colors.grey,
        shape: BoxShape.circle,
      ),
    );
  }
}
