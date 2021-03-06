﻿CREATE TABLE Tasks (
	TaskId INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	StoryId INT NOT NULL,
	TaskText VARCHAR(1000) NOT NULL,
    [State] VARCHAR(20) NOT NULL,
	EstimatedDevHours FLOAT NOT NULL DEFAULT 0,
	EstimatedQsHours FLOAT NOT NULL DEFAULT 0,
    DevHoursBurned FLOAT NOT NULL DEFAULT 0,
    QsHoursBurned FLOAT NOT NULL DEFAULT 0,
    RemainingDevHours FLOAT NOT NULL DEFAULT 0,
    RemainingQsHours FLOAT NOT NULL DEFAULT 0,
	Ordinal INT NOT NULL
)
