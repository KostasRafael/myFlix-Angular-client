import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }

 
  ngOnInit(): void {
    this.getUser();
  }

 

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        Password: this.userData.Password,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }
  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }
  backToMovie(): void {
    this.router.navigate(["movies"]);
  }

  getfavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.favoriteMovies = res.filter((movie: any) => {
        return this.userData.FavoriteMovies.includes(movie._id)
      })
    }, (err: any) => {
      console.error(err);
    });
  }

  getUser(): void {
    this.fetchApiData.getUserByID(this.userData.Username).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        Password: this.userData.Password,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getfavoriteMovies();
    })
  }

  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.userData.Username, movie._id).subscribe((res: any) => {
      this.userData.FavoriteMovies = res.FavoriteMovies;
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }
  
  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
  }
}