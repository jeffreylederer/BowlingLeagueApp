
create view [dbo].[AllTeamsWithNamesView]

as
SELECT
	   
	   case 
		when l.TeamSize = 1 then m1.NickName
		when l.TeamSize = 2 then m1.NickName + ', ' + m3.NickName
		else m1.NickName + ', ' + m2.NickName + ', ' + m3.NickName
		end as TeamMembers
      ,[TeamNo]
  FROM [dbo].[Team] t
  left outer join player p1 on p1.id = t.[skip]
  left outer join player p2 on p2.id = t.ViceSkip
  left outer join player p3 on p3.id = t.[lead]
  left outer join membership m1 on m1.id = p1.MembershipId
  left outer join membership m2 on m2.id = p2.MembershipId
  left outer join membership m3 on m3.id = p3.MembershipId
  inner join league l on l.id = t.Leagueid


  --exec [AllTeamsWithNames] 1010