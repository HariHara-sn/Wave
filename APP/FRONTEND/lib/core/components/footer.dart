import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  final Function(int) onTabChanged;
  final int currentIndex;

  const Footer({
    super.key,
    required this.onTabChanged,
    required this.currentIndex,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      margin: EdgeInsets.zero,
      padding: EdgeInsets.zero,
      child: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: currentIndex, // Highlight the selected tab
        onTap: onTabChanged, // Callback when a tab is clicked
        selectedItemColor: theme.primaryColor,
        unselectedItemColor: theme.iconTheme.color,
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet_outlined),
            label: 'Learning',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.book),
            label: 'MindSync',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.more_horiz_sharp),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
