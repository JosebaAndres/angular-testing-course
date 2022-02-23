import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";
import { HomeComponent } from "./home.component";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { click } from "../common/test-utils";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let debugElement: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(
    (course) => course.category === "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (course) => course.category === "ADVANCED"
  );

  beforeEach(// waitForAsync(() => {
  //   const soursesServiceSpy = jasmine.createSpyObj("CoursesService", [
  //     "findAllCourses",
  //   ]);

  //   TestBed.configureTestingModule({
  //     imports: [CoursesModule, NoopAnimationsModule],
  //     providers: [
  //       {
  //         provide: CoursesService,
  //         useValue: soursesServiceSpy,
  //       },
  //     ],
  //   })
  //     .compileComponents()
  //     .then(() => {
  //       fixture = TestBed.createComponent(HomeComponent);
  //       component = fixture.componentInstance;
  //       debugElement = fixture.debugElement;
  //       coursesService = TestBed.get(CoursesService);
  //     });
  // })
  fakeAsync(() => {
    const soursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [
        {
          provide: CoursesService,
          useValue: soursesServiceSpy,
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        coursesService = TestBed.get(CoursesService);
      });
    flush();
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs found");
  });

  it("should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = debugElement.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);
    fixture.detectChanges();
    flush();
    const cardTitles = debugElement.queryAll(
      By.css(".mat-tab-body-active .mat-card-title")
    );
    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course",
      "the tab is not changed on click"
    );
  }));

  xit(
    "should display advanced courses when tab clicked using waitForAsync (support HTTP request)",
    waitForAsync(() => {
      coursesService.findAllCourses.and.returnValue(of(setupCourses()));
      fixture.detectChanges();
      const tabs = debugElement.queryAll(By.css(".mat-tab-label"));
      click(tabs[1]);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const cardTitles = debugElement.queryAll(
          By.css(".mat-tab-body-active .mat-card-title")
        );
        expect(cardTitles.length).toBeGreaterThan(
          0,
          "Could not find card titles"
        );
        expect(cardTitles[0].nativeElement.textContent).toContain(
          "Angular Security Course",
          "the tab is not changed on click"
        );
      });
    })
  );
});
