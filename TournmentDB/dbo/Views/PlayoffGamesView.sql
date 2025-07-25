create view dbo.PlayoffGamesView

as
select  distinct s.id  from
match m
inner join schedule s on s.id = m.weekId