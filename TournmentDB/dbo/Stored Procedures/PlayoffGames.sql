create procedure dbo.PlayoffGames
@leagueid int
as
select  distinct s.id  from
match m
inner join schedule s on s.id = m.weekId
where s.leagueid =@leagueid and s.PlayOffs=1