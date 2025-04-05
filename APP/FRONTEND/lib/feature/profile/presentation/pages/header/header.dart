import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:learnpro/core/controllers/session_controller.dart';
import 'package:learnpro/feature/profile/presentation/pages/header/presentation/controllers/controller.dart';

class HeaderCard extends StatelessWidget {
  final ThemeData theme;
  HeaderCard({super.key, required this.theme});

  final sessionController = Get.find<SessionController>();
  final controller = Get.put(HeaderController());

  @override
  Widget build(BuildContext context) {
    final double screenWidth = MediaQuery.of(context).size.width;
    final double screenHeight = MediaQuery.of(context).size.height;

    return Stack(
      alignment: Alignment.topCenter,
      children: [
        // Gradient Background from Theme
        Container(
          width: double.infinity,
          height: screenHeight * 0.33, // 32% of screen height
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Colors.lightGreen, // Gradient start from theme
                Colors.black, // Gradient end from theme
              ],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
        ),

        // White Curved Background
        Positioned(
          bottom: 0,
          child: Container(
            width: screenWidth,
            height: screenHeight * 0.24, // 23% of screen height
            decoration: BoxDecoration(
              color: theme.colorScheme.background, // Theme background
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(40),
                topRight: Radius.circular(40),
              ),
            ),
          ),
        ),

        // Profile Image & User Details
        Positioned(
          top: screenHeight * 0.15, // 10% of screen height
          child: Column(
            children: [
              Stack(
                children: [
                  // Profile Image with Border
                  Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: theme.primaryColor, // Border color from theme
                        width: 3.0,
                      ),
                    ),
                    child: CircleAvatar(
                      radius: screenWidth * 0.10, // 10% of screen width
                      backgroundColor: Colors.transparent,
                      child: Obx(() {
                        String email = sessionController.emailId.value;
                        return Text(
                          email.isNotEmpty ? email[0].toUpperCase() : '?',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            fontSize: screenWidth * 0.08, // 8% of screen width
                            fontWeight: FontWeight.bold,
                          ),
                        );
                      }),
                    ),
                  ),

                  // Edit Icon Positioned at Bottom Right
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: GestureDetector(
                      onTap: () {
                        // showEditProfileDialog(context);
                      },
                      child: CircleAvatar(
                        backgroundColor: theme.colorScheme.primary,
                        radius: screenWidth * 0.035, // 3.5% of screen width
                        child: Icon(
                          Icons.edit,
                          size: screenWidth * 0.03, // 3% of screen width
                          color: theme.colorScheme.onPrimary,
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              SizedBox(height: screenHeight * 0.01), // 1% of screen height

              // User Name
              Obx(() {
                return Text(
                  sessionController.username.value.isNotEmpty
                      ? sessionController.username.value
                      : "Complete your profile",
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                );
              }),

              // User Email
              Obx(() {
                return Text(
                  sessionController.emailId.value.isNotEmpty
                      ? sessionController.emailId.value
                      : "Complete your profile",
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                );
              }),
            ],
          ),
        ),
      ],
    );
  }
}
