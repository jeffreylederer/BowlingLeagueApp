










CREATE   View [dbo].[OneMatchView]
as
SELECT m.[id],

m.Rink,
case
	when l.TeamSize = 1 then m11.[NickName]
    when l.TeamSize = 2  then  m11.[NickName] + ', '+ m13.[NickName]
	else m11.[NickName] + ', '+ m12.[NickName] + ', '+ m13.[NickName]
end as team1,
case
	when m22.[NickName] is null and m23.[NickName] is null then m21.[NickName]
    when m22.[NickName] is null then  m21.[NickName] + ', '+ m23.[NickName]
	else  m21.[NickName] + ', '+ m22.[NickName] + ', '+ m23.[NickName]
end as team2,

dbo.HasWheelChair(m12.Wheelchair, m12.Wheelchair, m13.Wheelchair) as wheelchair1,
dbo.HasWheelChair(m21.Wheelchair, m22.Wheelchair, m23.Wheelchair) as wheelchair2,
m.Team1Score,
m.Team2Score,
m.ForFeitId,
m.WeekId,
t1.TeamNo as Team1No,
t2.TeamNo as Team2No,
s.GameDate,
m.[Version]

      
  FROM [dbo].[Match] m
  join team t1 on m.TeamNo1 = t1.id
  join team t2 on m.TeamNo2 = t2.id

  join player p11 on t1.Skip = p11.id
  left outer join player p12 on t1.ViceSkip = p12.id
  left outer join player p13 on t1.Lead = p13.id

  join player p21 on t2.Skip = p21.id
  left outer join player p22 on t2.ViceSkip = p22.id
  left outer join player p23 on t2.Lead = p23.id

  join membership m11 on p11.MembershipId = m11.id
  left outer join  membership m12 on p12.MembershipId = m12.id
  left outer join  membership m13 on p23.MembershipId = m13.id

  join membership m21 on p21.MembershipId = m21.id
  left outer join  membership m22 on p22.MembershipId = m22.id
  left outer join  membership m23 on p23.MembershipId = m23.id

  inner join schedule s on s.id = m.WeekId
  inner join league l on l.id = t1.Leagueid