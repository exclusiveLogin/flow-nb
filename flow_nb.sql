-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Авг 19 2016 г., 11:13
-- Версия сервера: 5.7.13-0ubuntu0.16.04.2
-- Версия PHP: 7.0.8-0ubuntu0.16.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `flow_nb`
--
CREATE DATABASE IF NOT EXISTS `flow_nb` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `flow_nb`;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube1_dump`
--

CREATE TABLE `p_tube1_dump` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube1_h`
--

CREATE TABLE `p_tube1_h` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube1_m`
--

CREATE TABLE `p_tube1_m` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube2_dump`
--

CREATE TABLE `p_tube2_dump` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube2_h`
--

CREATE TABLE `p_tube2_h` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube2_m`
--

CREATE TABLE `p_tube2_m` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube3_dump`
--

CREATE TABLE `p_tube3_dump` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube3_h`
--

CREATE TABLE `p_tube3_h` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube3_m`
--

CREATE TABLE `p_tube3_m` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube4_dump`
--

CREATE TABLE `p_tube4_dump` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube4_h`
--

CREATE TABLE `p_tube4_h` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `p_tube4_m`
--

CREATE TABLE `p_tube4_m` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_id` int(11) NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube1_dump`
--

CREATE TABLE `tube1_dump` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube1_h`
--

CREATE TABLE `tube1_h` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube1_m`
--

CREATE TABLE `tube1_m` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube2_dump`
--

CREATE TABLE `tube2_dump` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube2_h`
--

CREATE TABLE `tube2_h` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube2_m`
--

CREATE TABLE `tube2_m` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube3_dump`
--

CREATE TABLE `tube3_dump` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube3_h`
--

CREATE TABLE `tube3_h` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube3_m`
--

CREATE TABLE `tube3_m` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube4_dump`
--

CREATE TABLE `tube4_dump` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube4_h`
--

CREATE TABLE `tube4_h` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tube4_m`
--

CREATE TABLE `tube4_m` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `p_tube1_dump`
--
ALTER TABLE `p_tube1_dump`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube1_h`
--
ALTER TABLE `p_tube1_h`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube1_m`
--
ALTER TABLE `p_tube1_m`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube2_dump`
--
ALTER TABLE `p_tube2_dump`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube2_h`
--
ALTER TABLE `p_tube2_h`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube2_m`
--
ALTER TABLE `p_tube2_m`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube3_dump`
--
ALTER TABLE `p_tube3_dump`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube3_h`
--
ALTER TABLE `p_tube3_h`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube3_m`
--
ALTER TABLE `p_tube3_m`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube4_dump`
--
ALTER TABLE `p_tube4_dump`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube4_h`
--
ALTER TABLE `p_tube4_h`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `p_tube4_m`
--
ALTER TABLE `p_tube4_m`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `p_id` (`p_id`);

--
-- Индексы таблицы `tube1_dump`
--
ALTER TABLE `tube1_dump`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube1_h`
--
ALTER TABLE `tube1_h`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube1_m`
--
ALTER TABLE `tube1_m`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube2_dump`
--
ALTER TABLE `tube2_dump`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube2_h`
--
ALTER TABLE `tube2_h`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube2_m`
--
ALTER TABLE `tube2_m`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube3_dump`
--
ALTER TABLE `tube3_dump`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube3_h`
--
ALTER TABLE `tube3_h`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube3_m`
--
ALTER TABLE `tube3_m`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube4_dump`
--
ALTER TABLE `tube4_dump`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube4_h`
--
ALTER TABLE `tube4_h`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `tube4_m`
--
ALTER TABLE `tube4_m`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `p_tube1_dump`
--
ALTER TABLE `p_tube1_dump`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube1_h`
--
ALTER TABLE `p_tube1_h`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube1_m`
--
ALTER TABLE `p_tube1_m`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube2_dump`
--
ALTER TABLE `p_tube2_dump`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube2_h`
--
ALTER TABLE `p_tube2_h`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube2_m`
--
ALTER TABLE `p_tube2_m`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube3_dump`
--
ALTER TABLE `p_tube3_dump`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube3_h`
--
ALTER TABLE `p_tube3_h`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube3_m`
--
ALTER TABLE `p_tube3_m`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube4_dump`
--
ALTER TABLE `p_tube4_dump`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube4_h`
--
ALTER TABLE `p_tube4_h`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `p_tube4_m`
--
ALTER TABLE `p_tube4_m`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube1_dump`
--
ALTER TABLE `tube1_dump`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube1_h`
--
ALTER TABLE `tube1_h`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube1_m`
--
ALTER TABLE `tube1_m`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube2_dump`
--
ALTER TABLE `tube2_dump`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube2_h`
--
ALTER TABLE `tube2_h`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube2_m`
--
ALTER TABLE `tube2_m`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube3_dump`
--
ALTER TABLE `tube3_dump`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube3_h`
--
ALTER TABLE `tube3_h`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube3_m`
--
ALTER TABLE `tube3_m`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube4_dump`
--
ALTER TABLE `tube4_dump`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube4_h`
--
ALTER TABLE `tube4_h`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `tube4_m`
--
ALTER TABLE `tube4_m`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
