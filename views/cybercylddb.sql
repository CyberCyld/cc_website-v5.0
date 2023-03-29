-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2023 at 06:07 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--

--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `ID` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 0,
  `name` varchar(45) NOT NULL,
  `OTP` varchar(45) DEFAULT NULL,
  `OTP_timestamp` int(11) DEFAULT NULL,
  `OTP_attempt` tinyint(4) DEFAULT NULL,
  `password_attempt` tinyint(4) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `blog`
--

CREATE TABLE `blog` (
  `id` int(100) NOT NULL,
  `head` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `type` varchar(200) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('Active','Delete') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blog`
--

INSERT INTO `blog` (`id`, `head`, `content`, `type`, `img`, `date`, `status`) VALUES
(2, 'Check if the image file is corrupted: Try opening the image file directly in an image viewer to see if it is corrupted or damaged.', 'Check if the image file is corrupted: Try opening the image file directly in an image viewer to see if it is corrupted or damaged.Check if the image file is corrupted: Try opening the image file directly in an image viewer to see if it is corrupted or damaged.Check if the image file is corrupted: Try opening the image file directly in an image viewer to see if it is corrupted or damaged.Check if the image file is corrupted: Try opening the image file directly in an image viewer to see if it is corrupted or damaged.Check if the image file is corrupted: Try opening the image file directly in an image viewer to see if it is corrupted or damaged.Check if the image file is corrupted: Try opening the image file directly in an image viewer to see if it is corrupted or damaged.Check if the image file is corrupted: Try opening the image file directly in an image viewer to see if it is corrupted or damaged.Check if the image file is corrupted: Try opening the image file directly in an image viewer to see if it is corrupted or damaged.', '', '?PNG\r\n\Z\n\0\0\0\rIHDR\0\0S\0\0U\0\0\0#E?+\0\0\0sRGB\0???\0\0\0gAMA\0\0???a\0\0\0	pHYs\0\0?\0\0??o?d\0\0?pIDATx^??|e???l/?	????w? EPAib9??g?????z?X?x6N?,tE?X? ??\Z?@?=?w?????(-uwf??~no?}\'??}f??;?B!?B!?Rs*j???h?&??	Hk???!?5 ԬG({?????*;*+m?<?^?ߋ?P|?G3', '2023-03-28 00:43:42', 'Delete'),
(3, 'In this example, we use {{#each}} to iterate over the posts array and display the relevant data for each post. We use {{head}} to display the post title, {{content}} to display the post content, and {{date}} to display the post date. We also use an <img> ', 'In this example, we use {{#each}} to iterate over the posts array and display the relevant data for each post. We use {{head}} to display the post title, {{content}} to display the post content, and {{date}} to display the post date. We also use an <img> tag to display the post image. We assume that the img property contains a base64-encoded image string, In this example, we use {{#each}} to iterate over the posts array and display the relevant data for each post. We use {{head}} to display the post title, {{content}} to display the post content, and {{date}} to display the post date. We also use an <img> tag to display the post image. We assume that the img property contains a base64-encoded image string, In this example, we use {{#each}} to iterate over the posts array and display the relevant data for each post. We use {{head}} to display the post title, {{content}} to display the post content, and {{date}} to display the post date. We also use an <img> tag to display the post image. We assume that the img property contains a base64-encoded image string, In this example, we use {{#each}} to iterate over the posts array and display the relevant data for each post. We use {{head}} to display the post title, {{content}} to display the post content, and {{date}} to display the post date. We also use an <img> tag to display the post image. We assume that the img property contains a base64-encoded image string, In this example, we use {{#each}} to iterate over the posts array and display the relevant data for each post. We use {{head}} to display the post title, {{content}} to display the post content, and {{date}} to display the post date. We also use an <img> tag to display the post image. We assume that the img property contains a base64-encoded image string, ', '', '?PNG\r\n\Z\n\0\0\0\rIHDR\0\0\0\0\0\0\0\0\0æ$?\0\0\0sBIT??O?\0\0\0	pHYs\0\0)\0\0)?x?\0\0\0tEXtSoftware\0www.inkscape.org??<\Z\0\0\0PLTE???\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0', '2023-03-28 12:17:16', 'Delete'),
(4, 'To style the buttons, you could use CSS. Here\'s an example:', 'Note that I also added a div with the blog-post-meta class to display the post date and the view, like, and dislike counts. You would need to update the view count and implement the like and dislike functionality on the server side.Note that I also added a div with the blog-post-meta class to display the post date and the view, like, and dislike counts. You would need to update the view count and implement the like and dislike functionality on the server side.Note that I also added a div with the blog-post-meta class to display the post date and the view, like, and dislike counts. You would need to update the view count and implement the like and dislike functionality on the server side.Note that I also added a div with the blog-post-meta class to display the post date and the view, like, and dislike counts. You would need to update the view count and implement the like and dislike functionality on the server side.Note that I also added a div with the blog-post-meta class to display the post date and the view, like, and dislike counts. You would need to update the view count and implement the like and dislike functionality on the server side.Note that I also added a div with the blog-post-meta class to display the post date and the view, like, and dislike counts. You would need to update the view count and implement the like and dislike functionality on the server side.Note that I also added a div with the blog-post-meta class to display the post date and the view, like, and dislike counts. You would need to update the view count and implement the like and dislike functionality on the server side.', '', '?PNG\r\n\Z\n\0\0\0\rIHDR\0\0\0?\0\0\0@\0\0\0??|?\0\0\0	pHYs\0\0,K\0\0,K?=??\0\0\0sRGB\0???\0\0\0gAMA\0\0???a\0\0?IDATx??[lWǿsf7q.m???RA????u???2<?S?\rBK?vh딇8/?V?H?>?~??u<?D?\"?l%\05?X?5n?y@?T	o????i?v??ovm???????Y??O?֞?^f????v?4?Y=?\r??X???\"?C3?<Hq?02gLhK?	??~', '2023-03-28 12:58:51', 'Delete'),
(5, 'Lakhamn', 'class=\"form-control\"class=\"form-control\"', 'draft', '?PNG\r\n\Z\n\0\0\0\rIHDR\0\0?\0\0?\0\0\0)\n??\0\0?DIDATx^??`\\W?6|??>?ޛ%ٖK???@h?\0	?PJ ?????۟???^R	?!??@zu?{S?z/????y?H???H?dK??:?[?yι?9o>F?`F?`F?`F?`F?`F?`F?`F?`F?`F?`F?`F?`F?`F?`F?`F?`F?`F?', '2023-03-28 13:11:11', 'Delete'),
(6, 'There is a syntax error in this query.', 'There is a syntax error in this query. The variable $blogId is not being correctly interpolated into the string. To fix this, you should use backticks () to surround the string and use ${}` to interpolate the variable:\r\n\r\nr\r\nCopy code\r\nconst deleteSql = `DELETE FROM \\`job_posting\\` WHERE \\`id\\` = \'${blogId}\'`;\r\nIn this fixed query, we use backticks to surround the string so that we can include single quotes inside the string without causing a syntax error. We also use ${} to interpolate the blogId variable into the string. Note that we also escape the backticks and single quotes inside the string using backslashes (\\) so that they are treated as literal characters in the SQL query.', 'Instagram', '?PNG\r\n\Z\n\0\0\0\rIHDR\0\0?\0\0$\0\0\0??V\0\0\0	pHYs\0\0,K\0\0,K?=??\0\0\0sRGB\0???\0\0\0gAMA\0\0???a\0??IDATx??_?}?u߇?u?0`???r?J?Mђ?R??(??W,9.B?Ky?T*?<y?C? PyH?D0??.;	AU9??R\\~p??? ?TũDc??X?*??X?\0????Y>{??}?Z?V????{????3u???w???{?>????ݛ	\0\0\0?G??,?_??????\'??H', '2023-03-28 16:21:49', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `job_posting`
--

CREATE TABLE `job_posting` (
  `id` int(11) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `job_description` text NOT NULL,
  `job_location` varchar(255) NOT NULL,
  `job_type` varchar(50) NOT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `posted_date` date NOT NULL,
  `application_deadline` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `job_posting`
--

INSERT INTO `job_posting` (`id`, `job_title`, `job_description`, `job_location`, `job_type`, `salary`, `posted_date`, `application_deadline`) VALUES
(2, 'Software Engineer', 'Need A Software EngineerNeed A Software EngineerNeed A Software EngineerNeed A Software EngineerNeed A Software Engineer', 'Lucknow', 'Full-Time', '23423.00', '0023-03-04', '0000-00-00'),
(4, 'Software Engineer', 'There is a syntax error in this query. The variable $blogId is not being correctly interpolated into the string. To fix this, you should use backticks () to surround the string and use ${}` to interpolate the variable:\r\n\r\nr\r\nCopy code\r\nconst deleteSql = `DELETE FROM \\`job_posting\\` WHERE \\`id\\` = \'${blogId}\'`;\r\nIn this fixed query, we use backticks to surround the string so that we can include single quotes inside the string without causing a syntax error. We also use ${} to interpolate the blogId variable into the string. Note that we also escape the backticks and single quotes inside the string using backslashes (\\) so that they are treated as literal characters in the SQL query.', 'Lucknow', 'Part-Time', '3122.00', '2023-03-08', '2023-03-28');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `itemone` varchar(255) DEFAULT NULL,
  `itemtwo` varchar(255) DEFAULT NULL,
  `itemthree` varchar(255) DEFAULT NULL,
  `itemfour` varchar(255) DEFAULT NULL,
  `itemfive` varchar(255) DEFAULT NULL,
  `itemsix` varchar(255) DEFAULT NULL,
  `itemseven` varchar(255) DEFAULT NULL,
  `itemeight` varchar(255) DEFAULT NULL,
  `itemnine` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `username`, `name`, `price`, `itemone`, `itemtwo`, `itemthree`, `itemfour`, `itemfive`, `itemsix`, `itemseven`, `itemeight`, `itemnine`, `date`) VALUES
(7, '', 'Personal Protection Plan', '3600', 'Cyber security audit for all social media accounts.', 'Cyber security protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Get Immediate help from our Cyber security experts.', 'Get minimum guaranteed money daily until acount not recovered.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', '2023-03-26 22:17:26'),
(8, '', 'Business Protection Plan', '7000', 'Cyber security audit for all social media accounts.', 'Cyber security protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Get Immediate help from our Cyber security experts.', 'Get minimum guaranteed money daily until acount not recovered.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', '2023-03-26 22:25:39'),
(9, '', 'Advance Protection Plan', '7000', 'Cyber security audit for all social media accounts.', 'Cyber security protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Get Immediate help from our Cyber security experts.', 'Get minimum guaranteed money daily until acount not recovered.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', 'Cyber security audit and protection for all Social Media accounts like Facebook, Instagram, Snapchat, Twitter, YouTube, LinkedIn etc.', '2023-03-26 22:25:44');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `payment_status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `ID` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 0,
  `name` varchar(45) NOT NULL,
  `OTP` varchar(45) DEFAULT NULL,
  `OTP_timestamp` int(11) DEFAULT NULL,
  `OTP_attempt` tinyint(4) DEFAULT NULL,
  `password_attempt` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `ID`, `email`, `active`, `name`, `OTP`, `OTP_timestamp`, `OTP_attempt`, `password_attempt`) VALUES
('rohit123', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '1e3b67b9-d64d-468f-91e5-04eca446b0b0', 'shaktitripathi12298@gmail.com', 1, 'Shakti Narayan Tripathi', 'b0f6406f9d502bd9f0fa0c2370199be4077408e7', 1679863417, 0, 0),
('rohit1233', '7c4a8d09ca3762af61e59520943dc26494f8941b', '34be78c4-5db7-4a2e-94a8-a115220d5e9d', 'shaktitripathi12298@gmail.com', 0, 'Shakti Narayan Tripathi', NULL, NULL, 0, 0),
('rohit1234', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', '6b799d2f-f4f3-4fc7-97eb-4f7f7f406ccb', 'shaktitripathi12298@gmail.com', 0, 'Shakti Narayan Tripathi', '1679863461', 0, 0, 45),
('shakti1', '965b38734b55904903e3f2e1589b99b7697a4546', '21c17a79-46d3-4930-9a9f-f3e4d59b8d4d', 'shaktitripathi12298@gmail.com', 0, 'Shakti Narayan Tripathi', '1679233944', 0, 0, 0),
('shakti121', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '54d24cf0-8dbc-40ba-8458-64cfa5881bc3', 'shaktitripathi12298@gmail.com', 1, 'Shakti Narayan Tripathi', NULL, NULL, 0, 70),
('shakti1233', '416f8f6e105370e7b9d0fd983141f00b613477f8', '6dcd8d61-83a6-422e-9bc7-feaee53946f2', 'shaktitripathi12298@gmail.com', 1, 'Shakti Narayan Tripathi', NULL, NULL, 0, 4),
('shakti12333', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', 'a159ad77-1bad-41ca-af69-95f219e43094', 'shaktitripathi12298@gmail.com', 1, 'Shakti Narayan Tripathi', NULL, NULL, 0, 0),
('shakti9628', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', 'b122a204-c2b4-4a2b-b811-b9dcd1153e75', 'shaktitripathi78@gmail.com', 0, '9628', '4c8e2c54e537be0baeb0553d8460c4bdfde1865a', 1679245768, 0, 0),
('shakti@123', '7b21848ac9af35be0ddb2d6b9fc3851934db8420', 'b4a2713a-c566-40ff-8ddc-a422e7afe0bb', 'shaktitripathi12298@gmail.com', 1, 'Shakti Narayan Tripathi', NULL, NULL, 0, 0),
('shaktiii123', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', 'af4ff0d3-623f-4b74-8f1e-037db1db60b7', 'shaktitripathi12298@gmail.com', 1, 'Shakti Narayan Tripathi', NULL, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `embed_link` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `title`, `embed_link`) VALUES
(0, 'Cyber Security', 'https://www.youtube.com/embed/00hpRjfbM0A');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_posting`
--
ALTER TABLE `job_posting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blog`
--
ALTER TABLE `blog`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `job_posting`
--
ALTER TABLE `job_posting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
