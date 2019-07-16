/**
 * Class that represents a problem.
 */
export class Problem {
  constructor(probNum, probTitle, probLink, probDesc, probAcc, probDiff) {
    this.probNum = (probNum === undefined) ? "" : probNum;
    this.probTitle = (probTitle === undefined) ? "" : probTitle;
    this.probLink = (probLink === undefined) ? "" : probLink;
    this.probDesc = (probDesc === undefined) ? "" : probDesc;
    this.probAcc = (probAcc === undefined) ? "" : probAcc;
    this.probDiff = (probDiff === undefined) ? "" : probDiff;
  }

  clearContents() {
    this.probNum = "";
    this.probTitle = "";
    this.probLink = "";
    this.probDesc = "";
    this.probAcc = "";
    this.probDiff = "";
  }
}
