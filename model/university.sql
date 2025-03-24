-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-03-2025 a las 15:26:07
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `university`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `course`
--

CREATE TABLE `course` (
  `id_course` int(11) NOT NULL,
  `credits` int(11) DEFAULT NULL,
  `id_professor` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `course`
--

INSERT INTO `course` (`id_course`, `credits`, `id_professor`, `name`) VALUES
(1, NULL, NULL, 'mateaticas 1'),
(2, 15, 1, 'mateaticas 1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscription`
--

CREATE TABLE `inscription` (
  `id_inscription` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `id_student` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscription`
--

INSERT INTO `inscription` (`id_inscription`, `date`, `id_student`) VALUES
(1, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscription_detail`
--

CREATE TABLE `inscription_detail` (
  `id` int(11) NOT NULL,
  `final_grade` decimal(5,2) DEFAULT NULL,
  `id_course` int(11) DEFAULT NULL,
  `id_inscription` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscription_detail`
--

INSERT INTO `inscription_detail` (`id`, `final_grade`, `id_course`, `id_inscription`) VALUES
(1, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `professor`
--

CREATE TABLE `professor` (
  `id_professor` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `lastname` varchar(25) NOT NULL,
  `name` varchar(25) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `speciality` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `professor`
--

INSERT INTO `professor` (`id_professor`, `email`, `lastname`, `name`, `phone`, `speciality`) VALUES
(1, NULL, 'dias', 'lucho', NULL, 'matematicas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `student`
--

CREATE TABLE `student` (
  `id_student` int(11) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `lastname` varchar(25) NOT NULL,
  `name` varchar(25) NOT NULL,
  `phone` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `student`
--

INSERT INTO `student` (`id_student`, `address`, `email`, `lastname`, `name`, `phone`) VALUES
(1, NULL, NULL, 'gabriel', 'luis', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id_course`),
  ADD KEY `FKqbdjm3d429dwet2e0swkwx48t` (`id_professor`);

--
-- Indices de la tabla `inscription`
--
ALTER TABLE `inscription`
  ADD PRIMARY KEY (`id_inscription`),
  ADD KEY `FK3cwbf58n1fc5f761ri4mf4p9j` (`id_student`);

--
-- Indices de la tabla `inscription_detail`
--
ALTER TABLE `inscription_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5o602nkbknr8by4bunoxesb0q` (`id_course`),
  ADD KEY `FK2cjjv16hpvaa2iu5nt2xtovni` (`id_inscription`);

--
-- Indices de la tabla `professor`
--
ALTER TABLE `professor`
  ADD PRIMARY KEY (`id_professor`);

--
-- Indices de la tabla `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id_student`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `course`
--
ALTER TABLE `course`
  MODIFY `id_course` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `inscription`
--
ALTER TABLE `inscription`
  MODIFY `id_inscription` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `inscription_detail`
--
ALTER TABLE `inscription_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `professor`
--
ALTER TABLE `professor`
  MODIFY `id_professor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `student`
--
ALTER TABLE `student`
  MODIFY `id_student` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `FKqbdjm3d429dwet2e0swkwx48t` FOREIGN KEY (`id_professor`) REFERENCES `professor` (`id_professor`);

--
-- Filtros para la tabla `inscription`
--
ALTER TABLE `inscription`
  ADD CONSTRAINT `FK3cwbf58n1fc5f761ri4mf4p9j` FOREIGN KEY (`id_student`) REFERENCES `student` (`id_student`);

--
-- Filtros para la tabla `inscription_detail`
--
ALTER TABLE `inscription_detail`
  ADD CONSTRAINT `FK2cjjv16hpvaa2iu5nt2xtovni` FOREIGN KEY (`id_inscription`) REFERENCES `inscription` (`id_inscription`),
  ADD CONSTRAINT `FK5o602nkbknr8by4bunoxesb0q` FOREIGN KEY (`id_course`) REFERENCES `course` (`id_course`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
