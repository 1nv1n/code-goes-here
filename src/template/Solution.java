/**
 * Class that contains the logic & implementation for the provided problem's solution.
 */
class CodeGoesHere {
  // The greeting.
  String greetStr = "Hello from Monaco!";

  /**
   * Return the stored greeting.
   * @return {@link String} consisting of the greeting.
   */
  public String greet() {
    return this.greetStr;
  }
}

/**
 * This is the driver of the solution.
 * This class is not expected to hold any logic,
 *  but rather to call into the method(s) from {@link CodeGoesHere} to perform the expected actions.
 */
public class Solution {
  /**
   * The entry point to executing the solution.
   * @param args {@link String} argument array from the standard input.
   */
  public static void main(String[] args) {
    // Create a new instance of the class that implements the logic.
    CodeGoesHere cGH = new CodeGoesHere();

    // Print the expected output to the standard output.
    System.out.println(cGH.greet());
  }
}
