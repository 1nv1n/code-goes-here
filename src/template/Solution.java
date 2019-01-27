class CodeGoesHere {
	String greetStr = "Hello from Monaco!";

	public String greet() {
		return this.greetStr;
	}
}

public class SolutionDriver {
	public static void main(String[] args) {
		CodeGoesHere cGH = new CodeGoesHere();
		System.out.println(cGH.greet());
	}
}