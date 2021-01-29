-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-01-2021 a las 16:40:50
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aerolinea`
--

CREATE TABLE `aerolinea` (
  `codigo` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `nombre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `pais` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `icao` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aeropuerto`
--

CREATE TABLE `aeropuerto` (
  `codigo` varchar(4) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `latitud` float(9,4) DEFAULT NULL,
  `longitud` float(9,4) DEFAULT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `pais` varchar(50) COLLATE utf8mb4_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_facturacion`
--

CREATE TABLE `datos_facturacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `apellido1` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `apellido2` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `dni` varchar(9) COLLATE utf8mb4_spanish_ci NOT NULL,
  `telefono` varchar(12) COLLATE utf8mb4_spanish_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `ciudad` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cod_postal` varchar(6) COLLATE utf8mb4_spanish_ci NOT NULL,
  `provincia` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `pais` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `iban` varchar(5) COLLATE utf8mb4_spanish_ci NOT NULL,
  `numero_cuenta` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cod_seguridad` varchar(3) COLLATE utf8mb4_spanish_ci NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `id` int(10) UNSIGNED NOT NULL,
  `reserva_id` int(10) UNSIGNED NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pasajeros_reserva`
--

CREATE TABLE `pasajeros_reserva` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `apellido1` varchar(150) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `apellido2` varchar(150) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `reserva_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `vuelo_id` bigint(20) UNSIGNED NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `n_pasajeros` int(1) NOT NULL DEFAULT 1,
  `n_maletas` int(1) NOT NULL DEFAULT 0,
  `precio_total` float(9,2) NOT NULL,
  `contacto_email` varchar(200) COLLATE utf8mb4_spanish_ci NOT NULL,
  `contacto_telefono` varchar(9) COLLATE utf8mb4_spanish_ci NOT NULL,
  `seguro_equipaje` varchar(1) COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'n',
  `transporte` varchar(1) COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'n',
  `estado` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'confirmada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_docs`
--

CREATE TABLE `user_docs` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `nombre` varchar(150) COLLATE utf8mb4_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `f_alta` timestamp NOT NULL DEFAULT current_timestamp(),
  `imagen` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `active` char(1) COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'n',
  `role` varchar(50) COLLATE utf8mb4_spanish_ci DEFAULT 'usuario',
  `validation_code` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vuelo`
--

CREATE TABLE `vuelo` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `origen` varchar(150) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `destino` varchar(150) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `fecha_salida` datetime DEFAULT NULL,
  `fecha_vuelta` datetime DEFAULT NULL,
  `hora_salida` time NOT NULL,
  `hora_llegada` time NOT NULL,
  `escalas` tinyint(1) NOT NULL DEFAULT 0,
  `lugar_escala` varchar(150) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `duracion` double(4,2) NOT NULL,
  `precio` float(9,2) DEFAULT NULL,
  `aerolinea_id` varchar(10) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `aeropuerto_origen` varchar(4) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `aeropuerto_destino` varchar(4) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `vuelta` varchar(1) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `n_personas` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aerolinea`
--
ALTER TABLE `aerolinea`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `aeropuerto`
--
ALTER TABLE `aeropuerto`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `datos_facturacion`
--
ALTER TABLE `datos_facturacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `datos_usu_fk1` (`user_id`);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doc_res` (`reserva_id`);

--
-- Indices de la tabla `pasajeros_reserva`
--
ALTER TABLE `pasajeros_reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pasaj_res_fk1` (`reserva_id`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usu_res_fk1` (`user_id`),
  ADD KEY `vue_res_fk2` (`vuelo_id`);

--
-- Indices de la tabla `user_docs`
--
ALTER TABLE `user_docs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usu_docs_fk1` (`user_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `vuelo`
--
ALTER TABLE `vuelo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vu_aer_fk1` (`aerolinea_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `datos_facturacion`
--
ALTER TABLE `datos_facturacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pasajeros_reserva`
--
ALTER TABLE `pasajeros_reserva`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_docs`
--
ALTER TABLE `user_docs`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `vuelo`
--
ALTER TABLE `vuelo`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `datos_facturacion`
--
ALTER TABLE `datos_facturacion`
  ADD CONSTRAINT `datos_usu_fk1` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `doc_res` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pasajeros_reserva`
--
ALTER TABLE `pasajeros_reserva`
  ADD CONSTRAINT `pasaj_res_fk1` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `usu_res_fk1` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `vue_res_fk2` FOREIGN KEY (`vuelo_id`) REFERENCES `vuelo` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_docs`
--
ALTER TABLE `user_docs`
  ADD CONSTRAINT `usu_docs_fk1` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
