import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../core/components/footer.dart'; // Footer Component
import 'package:learnpro/feature/landing_page_controller.dart'; // Landing page controller
import 'package:learnpro/feature/home/presentation/pages/home_page.dart'; // Home page
import 'package:learnpro/feature/Learning/presentation/pages/learning_page.dart'; // Wallet page
import 'package:learnpro/feature/MindSync/presentation/pages/mindsync_page.dart'; // Trip page
import 'package:learnpro/feature/profile/presentation/pages/profile_page.dart'; // More page

class LandingPage extends StatelessWidget {
  LandingPage({super.key});

  // Retrieve the existing controller instance
  final LandingPageController controller = Get.find<LandingPageController>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: controller.pageController,
        onPageChanged: controller.changePage,
        children: [
          const HomePage(),
          const WalletPage(),
          const TripMapPage(),
          ProfilePage(),
        ],
      ),
      bottomNavigationBar: Obx(
        () => Footer(
          onTabChanged: controller.changePage,
          currentIndex: controller.pageIndex.value,
        ),
      ),
    );
  }
}
