using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ReactType1.Server.Models;


namespace ReactType1.Server.Code
{


    public class TeamReportDoc 
    {




        public async Task<IDocument> CreateDocument(int id, DbLeagueApp db, string site)
        {
            League? league = await db.Leagues.FindAsync(id);

            string? LeagueName = league?.LeagueName;
            int? TeamSize = league?.TeamSize;
           

            List<TeamMember> list = db.TeamMembers
                     .FromSql($"EXEC TeamAllowDelete {id}")
                    .ToList();

            //foreach (var item in league.Teams)
            //{
            //    list.Add(new TeamMember
            //    {
            //        Division = item.DivisionId,
            //        TeamNo = item.TeamNo,
            //        Skip = item.Skip.HasValue ? item.SkipNavigation.Membership.FullName : "",
            //        ViceSkip = item.ViceSkip.HasValue ? item.ViceSkipNavigation.Membership.FullName : "",
            //        Lead = item.Lead.HasValue ? item.LeadNavigation.Membership.FullName : "",
            //    });
            //    }
            list.Sort((a, b) => a.TeamNo.CompareTo(b.TeamNo));


            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(50);

                    page.Header()
                           .AlignCenter()
                           .AlignMiddle()
                           .Column(column =>
                           {
                               column.Item().Text(site).FontSize(16);
                               column.Item().Text(" ");
                               column.Item().Text(league?.LeagueName);
                           });



                    page.Content().PaddingVertical(20).Column(column =>
                    {
                        column.Item().Inlined(inlined =>
                        {
                            inlined.Spacing(20);
                            inlined.Item().Text("");
                        });

                        column.Item().AlignCenter().Table(table =>
                        {
                            // step 1
                            table.ColumnsDefinition(columns =>
                            {
                                if (league?.Divisions > 1)
                                    columns.ConstantColumn(60);
                                columns.ConstantColumn(30);
                                columns.ConstantColumn(120);
                                if (TeamSize.HasValue && TeamSize.Value == 3)
                                {
                                    columns.ConstantColumn(120);
                                }
                                if (TeamSize.HasValue && TeamSize.Value > 1)
                                {
                                    columns.ConstantColumn(120);
                                }
                            });


                            static IContainer CellStyle2(IContainer container)
                            {
                                return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5).AlignCenter();
                            }

                            // step 3
                            if(league?.Divisions >1)
                                table.Cell().Element(CellStyle2).Text("Division").SemiBold().FontSize(10);
                            table.Cell().Element(CellStyle2).Text("Team No").SemiBold().FontSize(10);
                            table.Cell().Element(CellStyle2).Text("Skip").SemiBold().FontSize(10);
                            if (TeamSize.HasValue && TeamSize.Value == 3)
                            {
                                table.Cell().Element(CellStyle2).Text("Vice Skip").SemiBold();
                            }
                            if (TeamSize.HasValue && TeamSize.Value > 1)
                            {
                                table.Cell().Element(CellStyle2).Text("Lead").SemiBold();
                            }

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5);
                            }

                            foreach (var item in list)
                            {

                                if (league?.Divisions > 1)
                                    table.Cell().Element(CellStyle).Text(item.Division.ToString()).FontSize(10).AlignCenter();
                                table.Cell().Element(CellStyle).Text(item.TeamNo.ToString()).FontSize(10).AlignCenter();
                                table.Cell().Element(CellStyle).Text(item.Skip).FontSize(10).AlignLeft();
                                if (TeamSize.HasValue && TeamSize.Value == 3)
                                {
                                    table.Cell().Element(CellStyle).Text(item.ViceSkip).FontSize(10).AlignLeft();
                                }
                                if (TeamSize.HasValue && TeamSize.Value > 1)
                                {
                                    table.Cell().Element(CellStyle).Text(item.Lead).FontSize(10).AlignLeft();
                                }


                            }
                        });
                    }); //content
                }); //page
            });
        }  //method
    } // class
} //namespace


