namespace ReactType1.Server.DTOs.Match
{
    

    public class UpdateMatchDto
    {
        public int Id { get; set; }

   

        public int TeamNo1 { get; set; }

        public int? TeamNo2 { get; set; }


    }

    public class CreateMatchDto
    {
        public int Id { get; set; }

        public int WeekId { get; set; }

        public int Rink { get; set; }

        public int TeamNo1 { get; set; }

        public int? TeamNo2 { get; set; }

        public int Team1Score { get; set; }

        public int Team2Score { get; set; }

        public int ForFeitId { get; set; }
    }
}
